pragma solidity ^0.4.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/ProductLib.sol";
import "./ThrowHandler.sol";

contract TestProductLib is ThrowHandler {

    using ProductLib for ProductLib.ProductStorage;
    ProductLib.ProductStorage internal products;

    function getProduct() public pure returns (string, uint, uint32, string){
        string memory name = "Test product";
        string memory image = "Some hash";
        uint price = 10**9;
        uint32 quantity = 10;
        return (name, price, quantity, image);
    }

    function testAdd() public {
        (string memory name, uint price, uint32 quantity, string memory image) = getProduct();
        uint expectedId = 1;

        // Assert
        Assert.equal(uint(products.productMaxId), uint(0), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(0), "Count should be valid");

        //Act
        uint64 newId = products.add(name, price, quantity, image);

        Assert.equal(uint(newId), uint(expectedId), "New product should  be added");
        Assert.equal(uint(products.productMaxId), uint(1), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(1), "Count should be valid");
        Assert.equal(uint(products.entities[newId].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.entities[newId].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.entities[newId].name, name, "Name should be valid");
    }

    function testCheckQuantity() public  {
        // Arrange
        uint64 id = 1;
        uint32 quantityPositive = 5;
        uint32 quantityNegative = 50;
        // Act
        bool actual = products.checkQuantity(id, quantityPositive);

        // Assert positive
        Assert.equal(actual, true, "Quantity check should be true");

        // Act
        actual = products.checkQuantity(id, quantityNegative);

        // Assert negative
        Assert.equal(actual, false, "Quantity check should be false");
    }

    function testEdit() public {

        uint64 id = 1;
        string memory name = "Test product edited";
        uint price = 10**12;
        uint32 quantity = 15;
        string memory image = "some hash here";
        string memory emptyImage = "";

        uint64 editedId = products.edit(id, name, price, quantity, image);

        // Assert

        Assert.equal(uint(editedId), uint(id), "Product should  be edited");
        Assert.equal(uint(products.productMaxId), uint(1), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(1), "Count should be valid");
        Assert.equal(uint(products.entities[id].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.entities[id].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.entities[id].name, name, "Name should be valid");
        Assert.equal(products.entities[id].image, image, "image should be valid");

        editedId = products.edit(id, name, price, quantity, emptyImage);
        Assert.equal(products.entities[id].image, image, "image should be valid");
    }

    function testGet() public {
        uint64 eId = 1;
        //Act
        (uint64 id, string memory name, uint price, uint32 quantity, string memory image) = products.get(eId);

        // Assert
        Assert.equal(uint(eId), uint(id), "Product should  be edited");
        Assert.equal(uint(products.entities[id].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.entities[id].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.entities[id].name, name, "Name should be valid");
        Assert.equal(products.entities[id].image, image, "image should be valid");
    }

    function testGetLastProductId() public {
        // Arrange
        uint expected = 1;

        // Act
        uint actual = products.getLastProductId();

        // Assert
        Assert.equal(expected, actual, "Last product id should be got");
    }

    function testGetProductCount() public {
        // Arrange
        uint expected = 1;

        // Act
        uint actual = products.getProductCount();

        // Assert
        Assert.equal(expected, actual, "Last product id should be got");
    }

    function decreaseQuantityToMuch() public {
        uint32 oldQuantity = products.entities[1].quantity;
        products.decreaseQuantity(1, oldQuantity + 1);
    }

    function testDecreaseQuantity() public {
        // Arrange
        uint64 id = 1;
        uint32 delta = 4;

        uint32 oldQuantity = products.entities[id].quantity;

        // Act
        products.decreaseQuantity(id, delta);

        // Assert
        Assert.equal(uint(oldQuantity - delta), uint(products.entities[id].quantity), "Last product id should be got");

        // Act
        Assert.isFalse(execute('decreaseQuantityToMuch()'), "Should fail over limit");
    }

    function testRemove() public {
        // Arrange
        uint64 id = 1;

        // Act
        bool actual = products.remove(id);

        // Assert
        Assert.equal(true, actual, "Destroy has to return true");
        Assert.equal(products.productCount, uint(0), "Product count should be set");
        Assert.equal(products.productMaxId, uint(1), "Max id shouldn't be changed");
        Assert.equal(products.entities[id].id, uint(0), "Id of deleted product should be empty");
    }
}
