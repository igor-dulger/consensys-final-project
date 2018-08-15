var Marketplace = artifacts.require("./Marketplace.sol");
//var ShopLib = artifacts.require("./ShopLib.sol");
var ShopFactoryLib = artifacts.require("./ShopFactoryLib.sol");

module.exports = function (deployer) {
    // deployer.deploy(ShopLib).then(() => {
    //     deployer.link(ShopLib, Marketplace);

        deployer.deploy(ShopFactoryLib).then(() => {
            deployer.link(ShopFactoryLib, Marketplace);

            // deployer.deploy(ProductLib).then(() => {

                // deployer.link(ProductLib, Marketplace);
            return deployer.deploy(Marketplace);
            // });
       });
    // });
};
