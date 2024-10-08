import {BigNumber as BN} from "bignumber.js"
import {expect} from "chai"

import {QuoteStructOutput} from "../../../src/types/contracts/interfaces/ISymmio"
import {
	getTotalPartyALockedValuesForQuotes,
	getTotalPartyBLockedValuesForQuotes,
	getTradingFeeForQuotes,
	getTradingFeeForQuoteWithFilledAmount
} from "../../utils/Common"
import {logger} from "../../utils/LoggerUtils"
import {expectToBeApproximately} from "../../utils/SafeMath"
import {QuoteStatus} from "../Enums"
import {Hedger} from "../Hedger"
import {RunContext} from "../RunContext"
import {BalanceInfo, User} from "../User"
import {TransactionValidator} from "./TransactionValidator"

export type OpenPositionValidatorBeforeArg = {
	user: User
	quoteId: bigint
	hedger: Hedger
}

export type OpenPositionValidatorBeforeOutput = {
	balanceInfoPartyA: BalanceInfo
	balanceInfoPartyB: BalanceInfo
	quote: QuoteStructOutput
	feeCollectorBalance: bigint
}

export type OpenPositionValidatorAfterArg = {
	user: User
	hedger: Hedger
	quoteId: bigint
	openedPrice: bigint
	fillAmount: bigint
	beforeOutput: OpenPositionValidatorBeforeOutput
	newQuoteId?: bigint
	newQuoteTargetStatus?: QuoteStatus
}

export class OpenPositionValidator implements TransactionValidator {
	async before(context: RunContext, arg: OpenPositionValidatorBeforeArg): Promise<OpenPositionValidatorBeforeOutput> {
		logger.debug("Before OpenPositionValidator...")
		const quote = await context.viewFacet.getQuote(arg.quoteId)
		return {
			balanceInfoPartyA: await arg.user.getBalanceInfo(),
			balanceInfoPartyB: await arg.hedger.getBalanceInfo(await arg.user.getAddress()),
			quote: quote,
			feeCollectorBalance: await context.viewFacet.balanceOf(await context.viewFacet.getFeeCollector(quote.affiliate)),
		}
	}

	async after(context: RunContext, arg: OpenPositionValidatorAfterArg) {
		logger.debug("After OpenPositionValidator...")
		// Check Quote
		const newQuote = await context.viewFacet.getQuote(arg.quoteId)
		const oldQuote = arg.beforeOutput.quote
		expect(newQuote.quoteStatus).to.be.equal(QuoteStatus.OPENED)
		expect(newQuote.openedPrice).to.be.equal(arg.openedPrice)
		expect(newQuote.quantity).to.be.equal(arg.fillAmount)

		const newCollectorBalance = await context.viewFacet.balanceOf(await context.viewFacet.getFeeCollector(newQuote.affiliate))
		expect(newCollectorBalance).to.be.equal(arg.beforeOutput.feeCollectorBalance + await getTradingFeeForQuoteWithFilledAmount(context, newQuote.id!, arg.fillAmount))

		const oldLockedValuesPartyA = await getTotalPartyALockedValuesForQuotes([oldQuote])
		const newLockedValuesPartyA = await getTotalPartyALockedValuesForQuotes([newQuote])

		const oldLockedValuesPartyB = await getTotalPartyBLockedValuesForQuotes([oldQuote])
		const newLockedValuesPartyB = await getTotalPartyBLockedValuesForQuotes([newQuote])

		const fillAmountCoef = new BN(arg.fillAmount.toString()).div(new BN(oldQuote.quantity.toString()))
		const priceCoef = new BN(arg.openedPrice.toString()).div(new BN(oldQuote.requestedOpenPrice.toString()))
		const partially = !fillAmountCoef.eq(1)

		if (partially && arg.newQuoteId != null) {
			const newlyCreatedQuote = await context.viewFacet.getQuote(arg.newQuoteId!)
			expect(newlyCreatedQuote.quoteStatus).to.be.equal(arg.newQuoteTargetStatus!)
			const lv = await getTotalPartyALockedValuesForQuotes([newlyCreatedQuote])
			expect(newlyCreatedQuote.quantity).to.be.equal(oldQuote.quantity - arg.fillAmount)
			expect(lv).to.be.equal(new BN(oldLockedValuesPartyA.toString()).times(new BN(1).minus(fillAmountCoef)).toString())
		}

		const partialLockedValues = BigInt(new BN(oldLockedValuesPartyA.toString()).times(fillAmountCoef).toFixed(0, BN.ROUND_DOWN).toString())
		const partialWithPriceLockedValuesPartyA = BigInt(
			new BN(oldLockedValuesPartyA.toString()).times(fillAmountCoef).times(priceCoef).toFixed(0, BN.ROUND_DOWN).toString(),
		)
		const partialWithPriceLockedValuesPartyB = BigInt(
			new BN(oldLockedValuesPartyB.toString()).times(fillAmountCoef).times(priceCoef).toFixed(0, BN.ROUND_DOWN).toString(),
		)
		expectToBeApproximately(newLockedValuesPartyA, partialWithPriceLockedValuesPartyA)

		// Check Balances partyA
		const newBalanceInfoPartyA = await arg.user.getBalanceInfo()
		const oldBalanceInfoPartyA = arg.beforeOutput.balanceInfoPartyA
		if (oldQuote.quoteStatus == BigInt(QuoteStatus.CANCEL_PENDING)) {
			expect(newBalanceInfoPartyA.totalPendingLockedPartyA).to.be.equal(
				(oldBalanceInfoPartyA.totalPendingLockedPartyA - oldLockedValuesPartyA).toString(),
			)
		} else {
			expectToBeApproximately(newBalanceInfoPartyA.totalPendingLockedPartyA, oldBalanceInfoPartyA.totalPendingLockedPartyA - partialLockedValues)
		}
		expectToBeApproximately(newBalanceInfoPartyA.totalLockedPartyA, oldBalanceInfoPartyA.totalLockedPartyA + partialWithPriceLockedValuesPartyA)
		if (arg.newQuoteTargetStatus == QuoteStatus.CANCELED) {
			expect(newBalanceInfoPartyA.allocatedBalances).to.be.equal(
				(oldBalanceInfoPartyA.allocatedBalances + (await getTradingFeeForQuotes(context, [arg.newQuoteId!]))).toString(),
			)
		} else {
			expect(newBalanceInfoPartyA.allocatedBalances).to.be.equal(oldBalanceInfoPartyA.allocatedBalances.toString())
		}

		// Check Balances partyB
		const newBalanceInfoPartyB = await arg.hedger.getBalanceInfo(await arg.user.getAddress())
		const oldBalanceInfoPartyB = arg.beforeOutput.balanceInfoPartyB

		if (arg.newQuoteTargetStatus == QuoteStatus.CANCELED) {
			expect(newBalanceInfoPartyB.totalPendingLockedPartyB).to.be.equal(
				(oldBalanceInfoPartyB.totalPendingLockedPartyB - oldLockedValuesPartyB).toString(),
			)
		} else {
			expectToBeApproximately(newBalanceInfoPartyB.totalPendingLockedPartyB, oldBalanceInfoPartyB.totalPendingLockedPartyB - oldLockedValuesPartyB)
		}
		expectToBeApproximately(newBalanceInfoPartyB.totalLockedPartyB, oldBalanceInfoPartyB.totalLockedPartyB + partialWithPriceLockedValuesPartyB)
		expect(newBalanceInfoPartyB.allocatedBalances).to.be.equal(oldBalanceInfoPartyB.allocatedBalances.toString())
	}
}
