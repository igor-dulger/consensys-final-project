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
        console.log(contract, account)
        let results = [
            await contract.owner({from: account}),
            await contract.isAdmin(account, {from: account}),
            await contract.isSeller(account, {from: account})
        ];
        return {
            owner: (results[0] === account),
            admin: results[1],
            seller: results[2]
        }
    }
}

export default new Marketplace()
