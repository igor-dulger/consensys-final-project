Possible attacks:

Reentrancy:
Shop.withdraw function changes state before transfer, also withdraw uses
transfer instead of call
Shop.returnExtra uses transfer instead of call

Cross-function Race Conditions
Shop.withdraw function changes state before transfer, also withdraw uses
transfer instead of call
Shop.returnExtra uses transfer instead of call

Transaction-Ordering Dependence (TOD) / Front Running
Transaction ordering doesn't matter fro this Dapp

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

Available Accounts
==================
(0) 0x28dea337f6b81c351bebef8efb9fb6b92c2478b5
(1) 0xffd55d12f8177ca80fe5e694e3bbd910a1fed197
(2) 0x900ea3c5a59d40686e98b47d9600fdd61d679eff
(3) 0xc3bc44e4f46d0df95dc205958b7407b0bf7cee04
(4) 0xc266e8c6b50ff1084b173d723bf22a0d5c11299c
(5) 0xbaf39fe7d2084130e61bbbb9735e8a09b5050669
(6) 0xfca851bc582c42d255e8aea61d9d302accea585b
(7) 0xd411b3b8bd881e5a93191220593b49a244ee0f29
(8) 0xd77ec98d4a9e540b6ed2b86ffa37f62493dca2c2
(9) 0x9487bea7e25e586e8db80e5674896319b0feed6e

Private Keys
==================
(0) 3666a2fa567cb35a30e3eed73885b43fcf3df7120acb4ee00000ed72ce1c13ff
(1) 08d7133308ab7e4efcd4b48c78b49c52945b160bc3cb1b50d8648ed5c7a9207f
(2) b5c0d953e73c92238998045ac2139038cc2c599fbc180d4f96f32e065df86e8a
(3) 0932321af2d6ac34656ff218c2c2de2c7ceba4174864b9b95ae5562d842b02a6
(4) 4333f7bc6f074b70b29b21d35b881d07d1427d387f457d1d39cb94364d456d27
(5) 8ec49983a1049ba9f4c8635f1c4a4f2ec14dd2020433cd9a7e87bddd0f6855db
(6) b8ba1a5a5d4036db60db81e5c8dc3cb7ee659c0fb67c50e1ab1ad8c942c2f93a
(7) 36fe7abff3877a477045198ea09c7d4390d2bd41c1297a4ba113e7d12c6802b5
(8) c5cf13c7c58408940ea9fef150f895c043d6ec75c2edce7e11e156f84e2ba34f
(9) 418146b2c1af461d8da1a8dd64a31d62dc0431f2653c064fe7a925f535bcfda2

HD Wallet
==================
Mnemonic:      lemon humble thing edge thing bus post wealth educate trouble shine share


0xfbac2ddc6349445c83ceb553dd1b4150d6e988c4

Install
