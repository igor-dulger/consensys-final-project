pragma solidity ^0.4.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProductLib.sol";
import "./RequireProxy.sol";

contract RequireFalseThrower {
    using ProductLib for ProductLib.ProductStorage;
    ProductLib.ProductStorage internal products;

    function decreaseQuantityToMuch() public {
        string memory name = "Test product";
        uint price = 10**9;
        uint32 quantity = 10;
        uint id = products.add(name, price, quantity);
        products.decreaseQuantity(id, 11);
    }
}

contract TestProductLib {

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

    function getProduct() public pure returns (string, uint, uint32){
        string memory name = "Test product";
        uint price = 10**9;
        uint32 quantity = 10;
        return (name, price, quantity);
    }

    function testAdd() public {
        (string memory name, uint price, uint32 quantity) = getProduct();
        uint expectedId = 1;

        // Assert
        Assert.equal(uint(products.productMaxId), uint(0), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(0), "Count should be valid");

        //Act
        uint newId = products.add(name, price, quantity);

        // Assert
        Assert.equal(uint(newId), uint(expectedId), "New product should  be added");
        Assert.equal(uint(products.productMaxId), uint(1), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(1), "Count should be valid");
        Assert.equal(uint(products.list[newId].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.list[newId].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.list[newId].name, name, "Name should be valid");
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

        uint editedId = products.edit(id, name, price, quantity);

        // Assert
        Assert.equal(uint(editedId), uint(id), "Product should  be edited");
        Assert.equal(uint(products.productMaxId), uint(1), "Max id should valid");
        Assert.equal(uint(products.productCount), uint(1), "Count should be valid");
        Assert.equal(uint(products.list[id].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.list[id].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.list[id].name, name, "Name should be valid");
    }

    function testGet() public {
        uint eId = 1;
        //Act
        (uint id, string memory name, uint price, uint32 quantity) = products.get(eId);

        // Assert
        Assert.equal(uint(eId), uint(id), "Product should  be edited");
        Assert.equal(uint(products.list[id].price), uint(price), "Price should be valid");
        Assert.equal(uint(products.list[id].quantity), uint(quantity), "Quantity should be valid");
        Assert.equal(products.list[id].name, name, "Name should be valid");
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
        uint32 oldQuantity = products.list[1].quantity;
        products.decreaseQuantity(1, oldQuantity + 1);
    }

    function testDecreaseQuantity() public {
        // Arrange
        uint id = 1;
        uint32 delta = 4;
        uint32 oldQuantity = products.list[id].quantity;

        // Act
        products.decreaseQuantity(id, delta);

        // Assert
        Assert.equal(uint(oldQuantity - delta), uint(products.list[id].quantity), "Last product id should be got");

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
        Assert.equal(products.list[id].id, uint(0), "Id of deleted product should be empty");
    }

    function getListWithWrongFromTo() private view {
        products.getList(10, 1);
    }

    function testGetList() public {

        Assert.isFalse(execute('getListWithWrongFromTo()'), "Should fail over wrong params");
        (string memory name, uint price, uint32 quantity) = getProduct();

        uint[] memory ids = products.getList(1, 10);
        uint[] memory expected = new uint[](1);

        Assert.equal(expected, ids, "List with 0");

        products.add(name, price, quantity);
        products.add(name, price, quantity);
        products.add(name, price, quantity);
        products.add(name, price, quantity);
        ids = products.getList(1, 10);

        expected = new uint[](5);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 4;
        expected[3] = 5;
        Assert.equal(expected, ids, "List with 2,3,4,5,0");

        products.setPageSize(4);
        ids = products.getList(1, 10);
        expected = new uint[](4);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 4;
        expected[3] = 0;
        Assert.equal(expected, ids, "List 2,3,4,0");

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
        Assert.equal(expected, ids, "List 2,3,4,5");

        products.destroy(4);
        ids = products.getList(1, 8);
        expected = new uint[](5);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 5;
        expected[3] = 0;
        expected[4] = 0;
        Assert.equal(expected, ids, "List 2,3,5,0,0");

    }
}
