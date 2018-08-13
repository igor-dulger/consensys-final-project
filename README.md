# Online Marketplace

Description: An online marketplace that operates on the blockchain.

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

## Dependencies
+  [truffle](https://github.com/trufflesuite/truffle): Truffle framework
+  [ganache-cli](https://github.com/trufflesuite/ganache-cli): a command-line version of Truffle's blockchain server.

## Install

```
$  git clone git@github.com:igor-dulger/consensys-final-project.git MY_DIR
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
different roles point of views   

## More information

+ [Avoiding common attacks](https://github.com/igor-dulger/consensys-final-project/blob/master/avoiding_common_attacks.md)
+ [Design pattern desicions](https://github.com/igor-dulger/consensys-final-project/blob/master/design_pattern_desicions.md)
