# Online Marketplace

## Description: An online marketplace that operates on the blockchain.

There are a list of stores on a central marketplace where shoppers can purchase
goods posted by the store owners.

The central marketplace is managed by a group of administrators.
Admins allow store owners to add stores to the marketplace. Store owners can
manage their store’s inventory and funds. Shoppers can visit stores and purchase
goods that are in stock using cryptocurrency.

User Stories:
An administrator opens the web app. The web app reads the address and identifies
that the user is an admin, showing them admin only functions, such as managing
store owners. An admin adds an address to the list of approved store owners, so
if the owner of that address logs into the app, they have access to the store
owner functions.

An approved store owner logs into the app. The web app recognizes their address
and identifies them as a store owner. They are shown the store owner functions.
They can create a new storefront that will be displayed on the marketplace.
They can also see the storefronts that they have already created. They can
click on a storefront to manage it. They can add/remove products to the
storefront or change any of the products’ prices. They can also withdraw any
funds that the store has collected from sales.

A shopper logs into the app. The web app does not recognize their address so
they are shown the generic shopper application. From the main page they can
browse all of the storefronts that have been created in the marketplace.
Clicking on a storefront will take them to a product page. They can see a list
of products offered by the store, including their price and quantity. Shoppers
can purchase a product, which will debit their account and send it to the store.
The quantity of the item in the store’s inventory will be reduced by the appropriate amount.

## Implementation comments

Please don't consider this project as a real product, I have made it as a prof
of my knowledge and ability to write a Dapp, it is my first solidity
project and my first React project, so the correct name for it should
be **Ugly marketplace**. My UI is ugly like hell, ignore it.

Some remarks about implementation:
- In this project I wrote contracts and libraries, most libraries are internal
but factory is external. External factory allowed me to remove shop code from
marketplace, and to decrease gas cost.

- For product images I added **IPFS** integration. The implementation can be
found in _src/components/ManageProduct.js_ line 110

- Main contract marketplace uses **ENS** to get address for "uglymarketplace.test"
domain, **ENS** was installed and configured locally. You can find **ENS** usage
in _src/services/Marketplace.js_ lines 15-26. Local **ENS** can be found
in _contracts_ and _migrations_

- As soon as our marketplace is ugly, we will need to update it. For this
I implemented upgradeability pattern
(**Openzeppelin** developers are holly people :)), If you check _migrations/3_local_ens.js_ line 39 you will see that **ENS** points to _OwnedUpgradeabilityProxy_ which was connected to _Marketplace_ in _migrations/2_deploy_contracts.js_ line 17

- Shop is implemented as a separate contract, so when a seller creates a shop,
the marketplace creates a separate contract of a shop and transfers an ownership
 to the seller.

- In the project I used **Openzeppelin** solutions quite often, they provide
many useful functionality. A small comment about Openzeppelin, its native usage
in a truffle project is to load it as a node module but I moved contacts to
**contracts** directory, I did it to make my contracts truffle independent, I
used Remix + remixd to debug some my functions, truffles debugger is good, but
Remix debugger is way more convenient

- For vulnerabilities check I used [SmartDec](https://tool.smartdec.net/) service.
A very convenient and useful tool (It isn't advertisement, but it took 10-20
minutes to upload my code and got result)


## Dependencies
+ nodejs version 7.6 or higher
+  [truffle](https://github.com/trufflesuite/truffle): Truffle framework
+  [ganache-cli](https://github.com/trufflesuite/ganache-cli): a command-line
version of Truffle's blockchain server.
``Important note. You need Ganache CLI v6.1.8 (ganache-core: 2.2.1) or higher. If you have older version please reinstall it, upgradeability won't work for old versions``


## Install

```
$  git clone git@github.com:igor-dulger/consensys-final-project.git MY_DIR
OR
$  git clone https://github.com/igor-dulger/consensys-final-project.git MY_DIR
```

```
$ cd MY_DIR
$ npm install
```
 Start in another terminal

 ```
 $ ganache-cli
 ```

 copy mnemonic string and save it, you will see something like this  

 ```
  HD Wallet
 ==================
 Mnemonic:      make toilet coffee child enough artwork write sauce polar sport problem junior
 ```
 Return to the terminal where you installed the project

### Compile solidity contracts
```
$ truffle compile
```

### Check that all tests a passed
```
$ truffle test
```

### Deploy contracts to local blockchain
```
$ truffle migrate
```

### Start web server localhost:3000
```
$ npm run start
```

### Metamask configuration
Open metamask plugin in your browser. Logout from your current account. Click
*Import using account seed phrase*
Use mnemonics you saved before

### Testing tips
For testing just give your Account1 (marketplace owner) a seller role. Then
you will be able to see all marketplace functionality using just this account.
For following tests give Account2 Admin role and Account3 Seller role, Account4
will be your buyer. Use Metamask to switch between accounts and see the Dapp from
different roles points of view   

## More information

+ [Avoiding common attacks](https://github.com/igor-dulger/consensys-final-project/blob/master/avoiding_common_attacks.md)
+ [Design pattern decisions](https://github.com/igor-dulger/consensys-final-project/blob/master/design_pattern_desicions.md)
