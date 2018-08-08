pragma solidity ^0.4.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/ShopLib.sol";
import "./ThrowHandler.sol";

contract TestShopLib is ThrowHandler{

    using ShopLib for ShopLib.ShopStorage;
    ShopLib.ShopStorage internal shops;

    function getShop()
        public
        view
    returns (string, string, address, address) {
        string memory name = "Test shop";
        string memory description = "Some text";
        address shopAddress = address(this);
        address owner = address(msg.sender);
        return (name, description, shopAddress, owner);
    }

    function testAdd() public {
        (
            string memory name,
            string memory description,
            address shopAddress,
            address owner
        ) = getShop();
        uint expectedId = 1;

        // Assert
        Assert.equal(uint(shops.maxId), uint(0), "Max id should valid");
        Assert.equal(uint(shops.count), uint(0), "Count should be valid");

        //Act
        uint64 newId = shops.add(name, description, shopAddress, owner);

        Assert.equal(uint(newId), uint(expectedId), "New shop should  be added");
        Assert.equal(uint(shops.maxId), uint(1), "Max id should valid");
        Assert.equal(uint(shops.count), uint(1), "Count should be valid");
        Assert.equal(shops.entities[newId].owner, owner, "owner should be valid");
        Assert.equal(
            shops.entities[newId].shopAddress,
            shopAddress,
            "shopAddress should be valid"
        );
        Assert.equal(
            shops.entities[newId].description,
            description,
            "description should be valid"
        );
        Assert.equal(shops.entities[newId].name, name, "Name should be valid");

        Assert.equal(uint(shops.maxId), uint(1), "Max id should valid");
        Assert.equal(uint(shops.count), uint(1), "Count should be valid");

        newId = shops.add(name, description, shopAddress, owner);

        Assert.equal(uint(newId), uint(2), "Max id should valid");
        Assert.equal(uint(shops.maxId), uint(2), "Max id should valid");
        Assert.equal(uint(shops.count), uint(2), "Count should be valid");
    }

    function testGet() public {
        uint64 eId = 1;
        //Act
        (
            uint64 id,
            string memory name,
            string memory description,
            address shopAddress,
            address owner
        ) = shops.get(eId);

        // Assert

        Assert.equal(uint(shops.entities[eId].id), uint(id), "Product should  be edited");
        Assert.equal(shops.entities[eId].owner, owner, "owner should be valid");
        Assert.equal(
            shops.entities[eId].shopAddress,
            shopAddress,
            "shopAddress should be valid"
        );
        Assert.equal(
            shops.entities[eId].description,
            description,
            "description should be valid"
        );
        Assert.equal(shops.entities[eId].name, name, "Name should be valid");
    }

    function testGetLastId() public {
        // Arrange
        uint expected = 2;

        // Act
        uint actual = shops.getLastId();

        // Assert
        Assert.equal(expected, actual, "Last id should be got");
    }

    function testGetCount() public {
        // Arrange
        uint expected = 2;

        // Act
        uint actual = shops.getCount();

        // Assert
        Assert.equal(expected, actual, "Count of shops should be got");
    }

    function removeNotExisting() public {
        uint64 id = 1000;
        shops.remove(id);
    }

    function testRemove() public {
        // Arrange
        uint64 id = 1;

        // Act
        bool actual = shops.remove(id);

        // Assert
        Assert.isFalse(execute('removeNotExisting()'), "expected revert, id doesn't exists");
        Assert.equal(true, actual, "Remove has to return true");
        Assert.equal(shops.count, uint(1), "Count should be set");
        Assert.equal(shops.maxId, uint(2), "Max id shouldn't be changed");
        Assert.equal(shops.entities[id].id, uint(0), "Id of deleted shop should be empty");
    }
}
