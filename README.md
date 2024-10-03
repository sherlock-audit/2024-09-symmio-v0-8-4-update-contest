
# SYMMIO v0.8.4 Update Contest contest details

- Join [Sherlock Discord](https://discord.gg/MABEWyASkp)
- Submit findings using the issue page in your private contest repo (label issues as med or high)
- [Read for more details](https://docs.sherlock.xyz/audits/watsons)

# Q&A

### Q: On what chains are the smart contracts going to be deployed?
Any EVM-compatible network
___

### Q: If you are integrating tokens, are you allowing only whitelisted tokens to work with the codebase or any complying with the standard? Are they assumed to have certain properties, e.g. be non-reentrant? Are there any types of [weird tokens](https://github.com/d-xo/weird-erc20) you want to integrate?
Only whitelisted tokens can work with the codebase and these are USDC, USDT, and USDE.
___

### Q: Are there any limitations on values set by admins (or other roles) in the codebase, including restrictions on array lengths?
No
___

### Q: Are there any limitations on values set by admins (or other roles) in protocols you integrate with, including restrictions on array lengths?
No
___

### Q: For permissioned functions, please list all checks and requirements that will be made before calling the function.
There is a ultisig behind those functions and a couple of team members will review that call before executing it.
___

### Q: Is the codebase expected to comply with any EIPs? Can there be/are there any deviations from the specification?
The codebase should be optionally compliant with Diamond Standard (EIP-2535)
___

### Q: Are there any off-chain mechanisms for the protocol (keeper bots, arbitrage bots, etc.)? We assume they won't misbehave, delay, or go offline unless specified otherwise.
There is a Muon oracle that provides data such as the uPnL of parties' positions. You should consider that the oracle won't provide any stale prices.
___

### Q: What properties/invariants do you want to hold even if breaking them has a low/unknown impact?
Yes, report potential issues, including broken assumptions about function behavior, if they pose future integration risks. Key properties that should hold include correctness (accurate returns), security (resistant to manipulation), consistency (uniform behavior on-chain and off-chain), and reliability (functioning correctly under all conditions).

Correctness:
The function should return accurate and expected results based on its inputs and documented behavior. For example, if a read function is expected to return the current balance of an account, it should not return a cached or stale value.

Security:
The function should be resistant to manipulation and unauthorized access. It should not expose any vulnerabilities that could be exploited to return false or misleading information.

Consistency:
The function should behave uniformly across different environments (Different chains for example). 

Reliability:
The function should function correctly under all conditions, including edge cases and unexpected inputs. For example, a function that reads from a data structure should handle cases where the requested data does not exist and return a predefined error or null value.

Low severity issues falling in these categories would not be valid and issues falling in these categories would be valid only for future integrations of other protocols with Symm.
___

### Q: Please discuss any design choices you made.
All design decisions are documented and available here for reference:
https://docs.symm.io/
https://docs.symm.io/protocol-architecture/technical-documentation/contracts-documentation-0.8.4
___

### Q: Please list any known issues and explicitly state the acceptable risks for each known issue.
Any risk is acceptable
___

### Q: We will report issues where the core protocol functionality is inaccessible for at least 7 days. Would you like to override this value?
I would like to override the default value. The platform's core protocol functionality should not be inaccessible for more than 1 day. Any downtime exceeding 24 hours should be reported as a critical issue, as this could cause significant disruption to the platform's operations and user experience.
Also the liquidation functionality should not be inaccessible for more than 2 hours.
___

### Q: Please provide links to previous audits (if any).
https://docs.symm.io/legal-and-brand-and-security/security-audits-bugbounty/audits
___

### Q: Please list any relevant protocol resources.
https://docs.symm.io/
https://docs.symm.io/protocol-architecture/technical-documentation/contracts-documentation-0.8.4
___



# Audit scope


[protocol-core @ 8b6d7208a8ac8d64b3ab313039fef882a03af0f4](https://github.com/SYMM-IO/protocol-core/tree/8b6d7208a8ac8d64b3ab313039fef882a03af0f4)
- [protocol-core/contracts/Diamond.sol](protocol-core/contracts/Diamond.sol)
- [protocol-core/contracts/facets/Account/AccountFacet.sol](protocol-core/contracts/facets/Account/AccountFacet.sol)
- [protocol-core/contracts/facets/Account/AccountFacetImpl.sol](protocol-core/contracts/facets/Account/AccountFacetImpl.sol)
- [protocol-core/contracts/facets/Account/IAccountEvents.sol](protocol-core/contracts/facets/Account/IAccountEvents.sol)
- [protocol-core/contracts/facets/Account/IAccountFacet.sol](protocol-core/contracts/facets/Account/IAccountFacet.sol)
- [protocol-core/contracts/facets/Bridge/BridgeFacet.sol](protocol-core/contracts/facets/Bridge/BridgeFacet.sol)
- [protocol-core/contracts/facets/Bridge/BridgeFacetImpl.sol](protocol-core/contracts/facets/Bridge/BridgeFacetImpl.sol)
- [protocol-core/contracts/facets/Bridge/IBridgeEvents.sol](protocol-core/contracts/facets/Bridge/IBridgeEvents.sol)
- [protocol-core/contracts/facets/Bridge/IBridgeFacet.sol](protocol-core/contracts/facets/Bridge/IBridgeFacet.sol)
- [protocol-core/contracts/facets/Control/ControlFacet.sol](protocol-core/contracts/facets/Control/ControlFacet.sol)
- [protocol-core/contracts/facets/Control/IControlEvents.sol](protocol-core/contracts/facets/Control/IControlEvents.sol)
- [protocol-core/contracts/facets/Control/IControlFacet.sol](protocol-core/contracts/facets/Control/IControlFacet.sol)
- [protocol-core/contracts/facets/DiamondCut/DiamondCutFacet.sol](protocol-core/contracts/facets/DiamondCut/DiamondCutFacet.sol)
- [protocol-core/contracts/facets/DiamondCut/IDiamondCut.sol](protocol-core/contracts/facets/DiamondCut/IDiamondCut.sol)
- [protocol-core/contracts/facets/DiamondLoup/DiamondLoupFacet.sol](protocol-core/contracts/facets/DiamondLoup/DiamondLoupFacet.sol)
- [protocol-core/contracts/facets/DiamondLoup/IDiamondLoupe.sol](protocol-core/contracts/facets/DiamondLoup/IDiamondLoupe.sol)
- [protocol-core/contracts/facets/ForceActions/ForceActionsFacet.sol](protocol-core/contracts/facets/ForceActions/ForceActionsFacet.sol)
- [protocol-core/contracts/facets/ForceActions/ForceActionsFacetEvents.sol](protocol-core/contracts/facets/ForceActions/ForceActionsFacetEvents.sol)
- [protocol-core/contracts/facets/ForceActions/ForceActionsFacetImpl.sol](protocol-core/contracts/facets/ForceActions/ForceActionsFacetImpl.sol)
- [protocol-core/contracts/facets/ForceActions/IForceActionsFacet.sol](protocol-core/contracts/facets/ForceActions/IForceActionsFacet.sol)
- [protocol-core/contracts/facets/FundingRate/FundingRateFacet.sol](protocol-core/contracts/facets/FundingRate/FundingRateFacet.sol)
- [protocol-core/contracts/facets/FundingRate/FundingRateFacetImpl.sol](protocol-core/contracts/facets/FundingRate/FundingRateFacetImpl.sol)
- [protocol-core/contracts/facets/FundingRate/IFundingRateEvents.sol](protocol-core/contracts/facets/FundingRate/IFundingRateEvents.sol)
- [protocol-core/contracts/facets/FundingRate/IFundingRateFacet.sol](protocol-core/contracts/facets/FundingRate/IFundingRateFacet.sol)
- [protocol-core/contracts/facets/PartyA/IPartyAEvents.sol](protocol-core/contracts/facets/PartyA/IPartyAEvents.sol)
- [protocol-core/contracts/facets/PartyA/IPartyAFacet.sol](protocol-core/contracts/facets/PartyA/IPartyAFacet.sol)
- [protocol-core/contracts/facets/PartyA/PartyAFacet.sol](protocol-core/contracts/facets/PartyA/PartyAFacet.sol)
- [protocol-core/contracts/facets/PartyA/PartyAFacetImpl.sol](protocol-core/contracts/facets/PartyA/PartyAFacetImpl.sol)
- [protocol-core/contracts/facets/PartyBGroupActions/IPartyBGroupActionsEvents.sol](protocol-core/contracts/facets/PartyBGroupActions/IPartyBGroupActionsEvents.sol)
- [protocol-core/contracts/facets/PartyBGroupActions/IPartyBGroupActionsFacet.sol](protocol-core/contracts/facets/PartyBGroupActions/IPartyBGroupActionsFacet.sol)
- [protocol-core/contracts/facets/PartyBGroupActions/PartyBGroupActionsFacet.sol](protocol-core/contracts/facets/PartyBGroupActions/PartyBGroupActionsFacet.sol)
- [protocol-core/contracts/facets/PartyBPositionActions/IPartyBPositionActionsEvents.sol](protocol-core/contracts/facets/PartyBPositionActions/IPartyBPositionActionsEvents.sol)
- [protocol-core/contracts/facets/PartyBPositionActions/IPartyBPositionActionsFacet.sol](protocol-core/contracts/facets/PartyBPositionActions/IPartyBPositionActionsFacet.sol)
- [protocol-core/contracts/facets/PartyBPositionActions/PartyBPositionActionsFacet.sol](protocol-core/contracts/facets/PartyBPositionActions/PartyBPositionActionsFacet.sol)
- [protocol-core/contracts/facets/PartyBPositionActions/PartyBPositionActionsFacetImpl.sol](protocol-core/contracts/facets/PartyBPositionActions/PartyBPositionActionsFacetImpl.sol)
- [protocol-core/contracts/facets/PartyBQuoteActions/IPartyBQuoteActionsEvents.sol](protocol-core/contracts/facets/PartyBQuoteActions/IPartyBQuoteActionsEvents.sol)
- [protocol-core/contracts/facets/PartyBQuoteActions/IPartyBQuoteActionsFacet.sol](protocol-core/contracts/facets/PartyBQuoteActions/IPartyBQuoteActionsFacet.sol)
- [protocol-core/contracts/facets/PartyBQuoteActions/PartyBQuoteActionsFacet.sol](protocol-core/contracts/facets/PartyBQuoteActions/PartyBQuoteActionsFacet.sol)
- [protocol-core/contracts/facets/PartyBQuoteActions/PartyBQuoteActionsFacetImpl.sol](protocol-core/contracts/facets/PartyBQuoteActions/PartyBQuoteActionsFacetImpl.sol)
- [protocol-core/contracts/facets/Settlement/ISettlementFacet.sol](protocol-core/contracts/facets/Settlement/ISettlementFacet.sol)
- [protocol-core/contracts/facets/Settlement/SettlementFacet.sol](protocol-core/contracts/facets/Settlement/SettlementFacet.sol)
- [protocol-core/contracts/facets/Settlement/SettlementFacetEvents.sol](protocol-core/contracts/facets/Settlement/SettlementFacetEvents.sol)
- [protocol-core/contracts/facets/Settlement/SettlementFacetImpl.sol](protocol-core/contracts/facets/Settlement/SettlementFacetImpl.sol)
- [protocol-core/contracts/facets/ViewFacet/IViewFacet.sol](protocol-core/contracts/facets/ViewFacet/IViewFacet.sol)
- [protocol-core/contracts/facets/ViewFacet/ViewFacet.sol](protocol-core/contracts/facets/ViewFacet/ViewFacet.sol)
- [protocol-core/contracts/facets/liquidation/DeferredLiquidationFacetImpl.sol](protocol-core/contracts/facets/liquidation/DeferredLiquidationFacetImpl.sol)
- [protocol-core/contracts/facets/liquidation/ILiquidationEvents.sol](protocol-core/contracts/facets/liquidation/ILiquidationEvents.sol)
- [protocol-core/contracts/facets/liquidation/ILiquidationFacet.sol](protocol-core/contracts/facets/liquidation/ILiquidationFacet.sol)
- [protocol-core/contracts/facets/liquidation/LiquidationFacet.sol](protocol-core/contracts/facets/liquidation/LiquidationFacet.sol)
- [protocol-core/contracts/facets/liquidation/LiquidationFacetImpl.sol](protocol-core/contracts/facets/liquidation/LiquidationFacetImpl.sol)
- [protocol-core/contracts/interfaces/IERC165.sol](protocol-core/contracts/interfaces/IERC165.sol)
- [protocol-core/contracts/interfaces/IMultiAccount.sol](protocol-core/contracts/interfaces/IMultiAccount.sol)
- [protocol-core/contracts/interfaces/IPartiesEvents.sol](protocol-core/contracts/interfaces/IPartiesEvents.sol)
- [protocol-core/contracts/interfaces/ISymmio.sol](protocol-core/contracts/interfaces/ISymmio.sol)
- [protocol-core/contracts/interfaces/ISymmioPartyA.sol](protocol-core/contracts/interfaces/ISymmioPartyA.sol)
- [protocol-core/contracts/libraries/LibAccessibility.sol](protocol-core/contracts/libraries/LibAccessibility.sol)
- [protocol-core/contracts/libraries/LibAccount.sol](protocol-core/contracts/libraries/LibAccount.sol)
- [protocol-core/contracts/libraries/LibDiamond.sol](protocol-core/contracts/libraries/LibDiamond.sol)
- [protocol-core/contracts/libraries/LibLiquidation.sol](protocol-core/contracts/libraries/LibLiquidation.sol)
- [protocol-core/contracts/libraries/LibLockedValues.sol](protocol-core/contracts/libraries/LibLockedValues.sol)
- [protocol-core/contracts/libraries/LibMuonV04ClientBase.sol](protocol-core/contracts/libraries/LibMuonV04ClientBase.sol)
- [protocol-core/contracts/libraries/LibPartyBPositionsActions.sol](protocol-core/contracts/libraries/LibPartyBPositionsActions.sol)
- [protocol-core/contracts/libraries/LibPartyBQuoteActions.sol](protocol-core/contracts/libraries/LibPartyBQuoteActions.sol)
- [protocol-core/contracts/libraries/LibQuote.sol](protocol-core/contracts/libraries/LibQuote.sol)
- [protocol-core/contracts/libraries/LibSettlement.sol](protocol-core/contracts/libraries/LibSettlement.sol)
- [protocol-core/contracts/libraries/LibSolvency.sol](protocol-core/contracts/libraries/LibSolvency.sol)
- [protocol-core/contracts/libraries/LibUtils.sol](protocol-core/contracts/libraries/LibUtils.sol)
- [protocol-core/contracts/libraries/SharedEvents.sol](protocol-core/contracts/libraries/SharedEvents.sol)
- [protocol-core/contracts/libraries/muon/LibMuon.sol](protocol-core/contracts/libraries/muon/LibMuon.sol)
- [protocol-core/contracts/libraries/muon/LibMuonAccount.sol](protocol-core/contracts/libraries/muon/LibMuonAccount.sol)
- [protocol-core/contracts/libraries/muon/LibMuonForceActions.sol](protocol-core/contracts/libraries/muon/LibMuonForceActions.sol)
- [protocol-core/contracts/libraries/muon/LibMuonFundingRate.sol](protocol-core/contracts/libraries/muon/LibMuonFundingRate.sol)
- [protocol-core/contracts/libraries/muon/LibMuonLiquidation.sol](protocol-core/contracts/libraries/muon/LibMuonLiquidation.sol)
- [protocol-core/contracts/libraries/muon/LibMuonPartyA.sol](protocol-core/contracts/libraries/muon/LibMuonPartyA.sol)
- [protocol-core/contracts/libraries/muon/LibMuonPartyB.sol](protocol-core/contracts/libraries/muon/LibMuonPartyB.sol)
- [protocol-core/contracts/libraries/muon/LibMuonSettlement.sol](protocol-core/contracts/libraries/muon/LibMuonSettlement.sol)
- [protocol-core/contracts/multiAccount/MultiAccount.sol](protocol-core/contracts/multiAccount/MultiAccount.sol)
- [protocol-core/contracts/multiAccount/SymmioPartyA.sol](protocol-core/contracts/multiAccount/SymmioPartyA.sol)
- [protocol-core/contracts/multiAccount/SymmioPartyB.sol](protocol-core/contracts/multiAccount/SymmioPartyB.sol)
- [protocol-core/contracts/storages/AccountStorage.sol](protocol-core/contracts/storages/AccountStorage.sol)
- [protocol-core/contracts/storages/BridgeStorage.sol](protocol-core/contracts/storages/BridgeStorage.sol)
- [protocol-core/contracts/storages/GlobalAppStorage.sol](protocol-core/contracts/storages/GlobalAppStorage.sol)
- [protocol-core/contracts/storages/MAStorage.sol](protocol-core/contracts/storages/MAStorage.sol)
- [protocol-core/contracts/storages/MuonStorage.sol](protocol-core/contracts/storages/MuonStorage.sol)
- [protocol-core/contracts/storages/QuoteStorage.sol](protocol-core/contracts/storages/QuoteStorage.sol)
- [protocol-core/contracts/storages/SymbolStorage.sol](protocol-core/contracts/storages/SymbolStorage.sol)
- [protocol-core/contracts/utils/Accessibility.sol](protocol-core/contracts/utils/Accessibility.sol)
- [protocol-core/contracts/utils/Ownable.sol](protocol-core/contracts/utils/Ownable.sol)
- [protocol-core/contracts/utils/Pausable.sol](protocol-core/contracts/utils/Pausable.sol)


