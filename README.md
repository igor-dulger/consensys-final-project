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

truffle
●  	Your project should be a truffle project
○  	All of your contracts should be in a contracts directory
■  	Truffle compile should successfully compile contracts
○  	Migration contract and migration scripts should work
■  	Truffle migrate should successfully migrate contracts to a locally running ganache-cli test blockchain on port 8545
○  	All tests should be in a tests directory
■  	Running truffle test should migrate contracts and run your tests


Available Accounts
==================
(0) 0x7b0a8f5a633d66c4f6ba85272cfcb599e480b2f1
(1) 0xaee70339ea42e820e0cc121d1210432ee82e972a
(2) 0xfcbec15dd04155b7a880254410cdccd920f55d70
(3) 0xcf56b9ee6e488a95c9f35fc8c81a47e367b79d87
(4) 0x8f196dde3e3b6af5689b07b59adeab44598cfb59
(5) 0xa77927c5683c7350a2103cc8a0d57351d0683ea3
(6) 0x1d3b66dc6c51f0107a9583c525126ee31d1bcf7a
(7) 0x3492b6383dd1562085031675c556ec0148730ea8
(8) 0xfff81cf571523eac4e1899710f46b7f041d1fcd3
(9) 0xfe163eb753b2702b650fde21f6feb53db5669e14


Private Keys
==================
(0) 18b908b91ea364928aac296aa3b7e6120ea6d2c117e415acae9dd0e205ce3ade
(1) 0227e70b93ffbcb12c41d2d528a7b3dce655138a0c3600cc18312e5236219f82
(2) c682b0f065b96c4a10b584d2002ae6f0d2e7d3fbf4af60cba4666791f4be5502
(3) 37b47eec11a4e1c05b9cdad120127143369a2eb8bc97e6a4786559f42f21d9fc
(4) 3da67b5fb67943411759974c8178cbfa9d000c06ad4ccbcc43e2ae3d2d752f22
(5) 9bd9e008884e78f57a6b5dc744fb1aac6912483ddc8ce14486223a5da902bcb5
(6) fb462120da7c893c09955b054e8a67ad58560d2388fc17c506ad570e52f9d32b
(7) 54e9657bd18d4428b1d80f230b21aa0eb14770672cc2e850516ae470d33ee9d2
(8) c47c82f78ee529af8720bddf08007309897cb7695006f033235a0a2b3751930e
(9) 89bef1dbbbb840ef73bb5ec517e5a75c466cc905272c5cb445726507a75b41f5

HD Wallet
==================
Mnemonic:      make toilet coffee child enough artwork write sauce polar sport problem junior

0x52243a30acc53ee33e3ec4879506efd1a06ef708



Install
