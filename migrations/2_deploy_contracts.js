const Marketplace = artifacts.require("./Marketplace.sol");
const OwnedUpgradeabilityProxy = artifacts.require("./OwnedUpgradeabilityProxy.sol");
const ShopFactoryLib = artifacts.require("./ShopFactoryLib.sol");
const encodeCall = require('./helpers/encodeCall')

module.exports = function (deployer, network, accounts) {
    deployer.deploy(ShopFactoryLib)
    .then(() => {
        deployer.link(ShopFactoryLib, Marketplace);
        return deployer.deploy(Marketplace);
   })
   .then(() => {
       return deployer.deploy(OwnedUpgradeabilityProxy)
   })
   .then(() => {
       const initializeData = encodeCall('initialize', ['address'], [accounts[0]])
       return OwnedUpgradeabilityProxy
        .at(OwnedUpgradeabilityProxy.address)
        .upgradeToAndCall(Marketplace.address, initializeData);
   })
};
