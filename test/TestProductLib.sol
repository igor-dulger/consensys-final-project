pragma solidity ^0.4.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProductLib.sol";
import "./ThrowHandler.sol";

contract TestProductLib is ThrowHandler{

    using ProductLib for ProductLib.ProductStorage;
    ProductLib.ProductStorage internal products;

    function testSetPageSize() public {
        // Arrange
        uint16 pageSize = 22;

        // Act
        products.setPageSize(pageSize);

        // Assert
        Assert.equal(uint(products.pageSize), uint(pageSize), "Page size should be set");
    }

    function testGetPageSize() public  {
        // Arrange
        uint16 expected = 22;

        // Act
        uint16 actual = products.getPageSize();

        // Assert
        Assert.equal(uint(actual), uint(expected), "Get page size");
    }

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
        uint newId = products.add(name, price, quantity, image);

        // Assert
        bytes32 entityKey = ProductLib.getEntityKey(newId);

        uint prev = products.links[ProductLib.getPrevKey(newId)];
        uint next = products.links[ProductLib.getNextKey(newId)];

        uint zeroPrev = products.links[ProductLib.getPrevKey(0)];
        uint zeroNext = products.links[ProductLib.getNextKey(0)];

        Assert.equal(uint(zeroPrev), uint(newId), "prev of 0 should be correct");
        Assert.equal(uint(zeroNext), uint(newId), "next of 0 should be correct");

        Assert.equal(uint(prev), uint(0), "prev should be 0");
        Assert.equal(uint(next), uint(0), "next should be 0");


        Assert.equal(uint(newId), uint(expectedId), "New product should  be added");
        Assert.equal(uint(products.productMaxId), uint(1), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(1), "Count should be valid");
        Assert.equal(uint(products.entities[entityKey].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.entities[entityKey].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.entities[entityKey].name, name, "Name should be valid");
    }

    function testCheckQuantity() public  {
        // Arrange
        uint id = 1;
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

        uint id = 1;
        string memory name = "Test product edited";
        uint price = 10**12;
        uint32 quantity = 15;
        string memory image = "some hash here";
        string memory emptyImage = "";

        uint editedId = products.edit(id, name, price, quantity, image);

        // Assert

        bytes32 entityKey = ProductLib.getEntityKey(id);

        Assert.equal(uint(editedId), uint(id), "Product should  be edited");
        Assert.equal(uint(products.productMaxId), uint(1), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(1), "Count should be valid");
        Assert.equal(uint(products.entities[entityKey].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.entities[entityKey].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.entities[entityKey].name, name, "Name should be valid");
        Assert.equal(products.entities[entityKey].image, image, "image should be valid");

        editedId = products.edit(id, name, price, quantity, emptyImage);
        Assert.equal(products.entities[entityKey].image, image, "image should be valid");

    }

    function testGet() public {
        uint eId = 1;
        //Act
        (uint id, string memory name, uint price, uint32 quantity, string memory image) = products.get(eId);

        bytes32 entityKey = ProductLib.getEntityKey(id);

        // Assert
        Assert.equal(uint(eId), uint(id), "Product should  be edited");
        Assert.equal(uint(products.entities[entityKey].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.entities[entityKey].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.entities[entityKey].name, name, "Name should be valid");
        Assert.equal(products.entities[entityKey].image, image, "image should be valid");
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

    function execute(string signature) internal returns (bool){
        bytes4 sig = bytes4(keccak256(abi.encodePacked(signature)));
        address self = address(this);
        return self.call(sig);
    }

    function decreaseQuantityToMuch() public {
        uint32 oldQuantity = products.entities[ProductLib.getEntityKey(1)].quantity;
        products.decreaseQuantity(1, oldQuantity + 1);
    }

    function testDecreaseQuantity() public {
        // Arrange
        uint id = 1;
        uint32 delta = 4;

        bytes32 entityKey = ProductLib.getEntityKey(id);
        uint32 oldQuantity = products.entities[entityKey].quantity;

        // Act
        products.decreaseQuantity(id, delta);

        // Assert
        Assert.equal(uint(oldQuantity - delta), uint(products.entities[entityKey].quantity), "Last product id should be got");

        // Act
        Assert.isFalse(execute('decreaseQuantityToMuch()'), "Should fail over limit");
    }

    function testDestroy() public {
        // Arrange
        uint id = 1;

        // Act
        bool actual = products.destroy(id);

        // Assert
        Assert.equal(true, actual, "Destroy has to return true");
        Assert.equal(products.productCount, uint(0), "Product count should be set");
        Assert.equal(products.productMaxId, uint(1), "Max id shouldn't be changed");
        Assert.equal(products.entities[ProductLib.getEntityKey(id)].id, uint(0), "Id of deleted product should be empty");

        uint prev = products.links[ProductLib.getPrevKey(id)];
        uint next = products.links[ProductLib.getNextKey(id)];

        uint zeroPrev = products.links[ProductLib.getPrevKey(0)];
        uint zeroNext = products.links[ProductLib.getNextKey(0)];

        Assert.equal(uint(zeroPrev), uint(0), "prev of 0 should be correct");
        Assert.equal(uint(zeroNext), uint(0), "next of 0 should be correct");
        Assert.equal(uint(prev), uint(0), "prev should be 0");
        Assert.equal(uint(next), uint(0), "next should be 0");
    }

    function testGetList() public {
        // id = 1 was deleted, product list is empty, next id will be 2
        (string memory name, uint price, uint32 quantity, string memory image) = getProduct();

        uint[] memory ids = products.getList(1, 10);
        uint[] memory expected = new uint[](1);

        Assert.equal(ids.length, 0, "List with 0");

        products.add(name, price, quantity, image); //id = 2
        products.add(name, price, quantity, image);
        products.add(name, price, quantity, image);
        products.add(name, price, quantity, image); //id = 5
        ids = products.getList(1, 10);

        Assert.equal(ids.length, 4, "List with 4 products");

        expected = new uint[](4);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 4;
        expected[3] = 5;
        Assert.equal(expected, ids, "List with 2,3,4,5");

        products.setPageSize(3);
        ids = products.getList(2, 8);
        expected = new uint[](3);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 4;
        Assert.equal(expected, ids, "List 2,3,4");

        products.setPageSize(10);
        ids = products.getList(2, 8);
        expected = new uint[](4);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 4;
        expected[3] = 5;
        Assert.equal(expected, ids, "List 2,3,4,5 pageSize 10");

        products.destroy(4);
        ids = products.getList(1, 8);
        expected = new uint[](3);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 5;
        Assert.equal(expected, ids, "List 2,3,5");
     }
}
