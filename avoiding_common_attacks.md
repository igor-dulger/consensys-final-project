Below you  will find a list of possible attack:

Reentrancy:
Shop.withdraw function changes state before transfer, also withdraw uses
transfer instead of call
Shop.returnExtra uses transfer instead of call

Cross-function Race Conditions
Shop.withdraw function changes state before transfer, also withdraw uses
transfer instead of call
Shop.returnExtra uses transfer instead of call

Transaction-Ordering Dependence (TOD) / Front Running
Transaction ordering doesn't matter for this Dapp

Timestamp Dependence
Dapp doesn't use timestamps

Integer Overflow and Underflow
Dapp uses SafeMath for all math operations

Underflow in Depth: Storage Manipulation
Dapp uses SafeMath for all math operations

DoS with (Unexpected) revert
If an attacker uses revert it will influence only his transaction

DoS with Block Gas Limit
Dapp doesn't do any batch operations

Forcibly Sending Ether to a Contract
The more money the better :), Dapp doesn't use any balance check logic
