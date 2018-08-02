class DataProvider {
    constructor() {
        this.web3 = null
        this.marketplace = null
        this.shop = null
        this.account = null
    }

    init(web3, account, marketplace, shop) {
        this.web3 = web3
        this.marketplace = marketplace
        this.shop = shop
        this.account = account
    }

    set(input) {
        for (var key in input) {
            if (key) {
                this[key] = input[key]
            }
        }
    }
}

export default new DataProvider()
