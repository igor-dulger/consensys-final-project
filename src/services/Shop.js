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
            let contract = dataProvider.web3.eth.contract(Shop.abi)
            resolve(contract.at(address))
        })
//        return Shop.at(address)
    }

    name() {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.name(
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        });
//        return dataProvider.shop.name({from: account})
    }

    description() {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.description(
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        });
//        return dataProvider.shop.description({from: account})
    }

    owner() {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.owner(
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        });
//        return dataProvider.shop.owner({from: account})
    }

    buyProduct(id, quantity, price) {
        const account = dataProvider.account
        const value = quantity * dataProvider.web3.toWei(price)
        return new Promise((resolve, reject) => {
            dataProvider.shop.buyProduct(
                id,
                quantity,
                {from: account, value: value},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        });
    }

    addProduct(name, price, quantity, image) {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.addProduct(
                name,
                price,
                quantity,
                image,
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        });
//        return dataProvider.shop.addProduct(name, price, quantity, image, {from: account})
    }

    editProduct(id, name, price, quantity, image) {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.editProduct(
                id,
                name,
                price,
                quantity,
                image,
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        });
        // return dataProvider.shop.editProduct(
        //     id, name, price, quantity, image, {from: account}
        // )
    }

    estimateGasdeleteProduct(id) {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.deleteProduct.estimateGas(
                id,
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        })
    }

    deleteProduct(id) {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            this.estimateGasdeleteProduct(id).then((gas) => {
                dataProvider.shop.deleteProduct(
                    id,
                    {from: account, gas: gas+100000},
                    (e, r) => { if (e) { reject(e) } else { resolve(r) }}
                )
            })
        })
//        return dataProvider.shop.deleteProduct(id, {from: account})
    }

    getProduct(id) {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.getProduct(
                id,
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        });
//        return dataProvider.shop.getProduct(id, {from: account})
    }

    getNext(id) {
        const account = dataProvider.account
        return new Promise((resolve, reject) => {
            dataProvider.shop.getNext(
                id,
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        })
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
        return new Promise((resolve, reject) => {
            dataProvider.shop.withdraw(
                value,
                {from: account},
                (e, r) => { if (e) { reject(e) } else { resolve(r) }}
            )
        })
        //return dataProvider.shop.withdraw(value, {from: account})
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
        return dataProvider.shop.ProductSold()
    }

    getWatcherProductQuantityDecreased() {
        return dataProvider.shop.ProductQuantityDecreased()
    }
}

export default new Shop()
