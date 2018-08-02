import dataProvider from '../services/DataProvider'

let getAccounts = () => {
    return new Promise((resolve, reject) => {
        dataProvider.web3.eth.getAccounts((err, acc) => {
            if (err) {
                reject(err)
            } else {
                resolve(acc)
            }
        })
    })
}
export default getAccounts
