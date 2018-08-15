pragma solidity ^0.4.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/ShopFactoryLib.sol";
import "../../contracts/Shop.sol";
import "./ThrowHandler.sol";

contract TestShopFactoryLib is ThrowHandler{

    function testCreate() public {

        string memory name = "Test shop";
        string memory description = "Test description";

        address shop_address = ShopFactoryLib.create(name, description);
        Shop shop = Shop(shop_address);

        // Assert
        Assert.equal(shop.name(), name, "Name should match");
        Assert.equal(shop.description(), description, "Description should match");
        Assert.equal(shop.owner(), msg.sender, "Description should match");
    }
}
