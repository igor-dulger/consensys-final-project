import MarketplaceArtiffact from '../../build/contracts/Marketplace.json'
import dataProvider from '../services/DataProvider'

class Marketplace {
    // constructor() {
    // }

    async getContract() {
        const contract = require('truffle-contract')
        const Marketplace = contract(MarketplaceArtiffact)
        Marketplace.setProvider(dataProvider.web3.currentProvider)
        return await Marketplace.deployed()
    }

    async getRoles() {
        const contract = dataProvider.marketplace
        const account = dataProvider.account
        console.log("Get roles", contract, account)

        contract.isAdmin(account, {from: account}).then((result)=>{
            console.log("Is admin", account, result)
        })

        let results = [
            await contract.owner({from: account}),
            await contract.isAdmin(account, {from: account}),
            await contract.isSeller(account, {from: account})
        ];
        console.log("Roles result", results)
        return {
            owner: (results[0] === account),
            admin: results[1],
            seller: results[2]
        }
    }

    addAdmin(address) {
        const account = dataProvider.account
        return dataProvider.marketplace.addAdmin(address, {from: account})
    }

    removeAdmin(address) {
        const account = dataProvider.account
        return dataProvider.marketplace.removeAdmin.estimateGas(address, {from: account}).then((gas) => {
            return dataProvider.marketplace.removeAdmin(address, {from: account, gas: gas + 30000})
        })
    }

    isAdmin(address) {
        const account = dataProvider.account
        return dataProvider.marketplace.isAdmin(address, {from: account})
    }

    addSeller(address) {
        const account = dataProvider.account
        return dataProvider.marketplace.addSeller(address, {from: account})
    }

    removeSeller(address) {
        const account = dataProvider.account
        return dataProvider.marketplace.removeSeller.estimateGas(address, {from: account}).then((gas) => {
            return dataProvider.marketplace.removeSeller(address, {from: account, gas: gas + 30000})
        })
    }

    isSeller(address) {
        const account = dataProvider.account
        return dataProvider.marketplace.isSeller(address, {from: account})
    }

    createShop(name, description) {
        const account = dataProvider.account
        return dataProvider.marketplace.createShop(name, description, {from: account})
    }

    deleteShop(id) {
        const account = dataProvider.account
        return dataProvider.marketplace.deleteShop.estimateGas(id, {from: account}).then((gas) => {
            return dataProvider.marketplace.deleteShop(id, {from: account, gas: gas + 100000})
        })
    }

    getShop(id) {
        const account = dataProvider.account
        return dataProvider.marketplace.getShop(id, {from: account})
    }

    getNext(id) {
        const account = dataProvider.account
        return dataProvider.marketplace.getNext(id, {from: account})
    }

    getSellersNext(id) {
        const account = dataProvider.account
        return dataProvider.marketplace.getSellersNext(account, id, {from: account})
    }

    getWatcherAddRole(role) {
        return dataProvider.marketplace.RoleAdded(
            {
                role: role
            }
        )
    }

    getWatcherRemoveRole(role) {
        return dataProvider.marketplace.RoleRemoved(
            {
                role: role
            }
        )
    }

    getWatcherShopAdded() {
        // return new Promise((resolve, reject) => {
        //     dataProvider.web3.eth.getBlockNumber(function(e, r){
        //         let event = dataProvider.marketplace.ShopAdded(
        //             {},
        //             {fromBlock: r, toBlock: 'latest'}
        //         )
        //         console.log("Add watcher fromBlock: " + r)
        //         resolve(event)
        //     })
        // })

        return dataProvider.marketplace.ShopAdded({})
    }

    getWatcherShopDeleted() {
        // return new Promise((resolve, reject) => {
        //     dataProvider.web3.eth.getBlockNumber(function(e, r){
        //         let event = dataProvider.marketplace.ShopDeleted(
        //             {},
        //             {fromBlock: r, toBlock: 'latest'}
        //         )
        //         console.log("Add watcher fromBlock: " + r)
        //         resolve(event)
        //     })
        // })
        return dataProvider.marketplace.ShopDeleted({})
    }

}

export default new Marketplace()
