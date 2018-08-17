import dataProvider from '../services/DataProvider'

let getNetworkType = () => {
    const networkId = dataProvider.web3.version.network
    console.log("Network id", networkId)
    let networkName = ''

    switch (networkId) {
      case "1":
        networkName = "Main";
        break;
      case "2":
       networkName = "Morden";
       break;
      case "3":
        networkName = "Ropsten";
        break;
      case "4":
        networkName = "Rinkeby";
        break;
      case "42":
        networkName = "Kovan";
        break;
      default:
        networkName = "Private";
    }
    return networkName
}
export default getNetworkType
