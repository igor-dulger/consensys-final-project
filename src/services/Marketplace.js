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
        return dataProvider.marketplace.removeAdmin(address, {from: account})
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
        return dataProvider.marketplace.removeSeller(address, {from: account})
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
        return dataProvider.marketplace.deleteShop(id, {from: account})
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
}

export default new Marketplace()
