import ShopArtiffact from '../../build/contracts/Shop.json'
import dataProvider from '../services/DataProvider'

class Shop {
    // constructor() {
    // }

    getContract(address) {
        if (dataProvider.shop && dataProvider.shop.address === address) {
            return new Promise((resolve, reject) => {
                resolve(dataProvider.shop)
            })
        }

        const contract = require('truffle-contract')
        const Shop = contract(ShopArtiffact)
        Shop.setProvider(dataProvider.web3.currentProvider)
        return new Promise((resolve, reject) => {
            resolve(new Shop(address))
        })
    }

    name() {
        const account = dataProvider.account
        return dataProvider.shop.name({from: account})
    }

    description() {
        const account = dataProvider.account
        return dataProvider.shop.description({from: account})
    }

    owner() {
        const account = dataProvider.account
        return dataProvider.shop.owner({from: account})
    }

    buyProduct(id, quantity, price) {
        const account = dataProvider.account
        const value = quantity * dataProvider.web3.toWei(price)
        return dataProvider.shop.buyProduct(id, quantity, {from: account, value: value})
    }

    addProduct(name, price, quantity, image) {
        const account = dataProvider.account
        return dataProvider.shop.addProduct(name, price, quantity, image, {from: account})
    }

    editProduct(id, name, price, quantity, image) {
        const account = dataProvider.account
        return dataProvider.shop.editProduct(
            id, name, price, quantity, image, {from: account}
        )
    }

    deleteProduct(id) {
        const account = dataProvider.account
        return dataProvider.shop.deleteProduct.estimateGas(id, {from: account}).then((gas) => {
            return dataProvider.shop.deleteProduct(id, {from: account, gas: gas + 100000})
        })
    }

    getProduct(id) {
        const account = dataProvider.account
        return dataProvider.shop.getProduct(id, {from: account})
    }

    getNext(id) {
        const account = dataProvider.account
        return dataProvider.shop.getNext(id, {from: account})
    }

    getBalance() {
        return new Promise((resolve, reject) => {
            dataProvider.web3.eth.getBalance(
                dataProvider.shop.address,
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        })
    }

    withdraw(value) {
        const account = dataProvider.account
        return dataProvider.shop.withdraw(value, {from: account})
    }

    getWatcherProductAdded() {
        return dataProvider.shop.ProductAdded()
    }

    getWatcherProductEdited(id) {
        return dataProvider.shop.ProductEdited({id: id})
    }

    getWatcherProductDeleted() {
        return dataProvider.shop.ProductDeleted()
    }

    getWatcherProductSold() {
        var event = dataProvider.shop.ProductSold()
        return event
    }

    getWatcherProductQuantityDecreased() {
        return dataProvider.shop.ProductQuantityDecreased()
    }
}

export default new Shop()
