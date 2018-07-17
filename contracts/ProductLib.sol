pragma solidity ^0.4.24;

//import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './openzeppelin/math/SafeMath.sol';

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library ProductLib {
    using SafeMath for uint;
    using SafeMath for uint32;

    struct Product {
        uint id;
        string name;
        uint price;
        uint32 quantity;
    }

    struct ProductStorage {
        uint productCount;
        mapping (uint => Product) list;
    }

    modifier inStorage(ProductStorage storage self, uint _id) {
        require(self.list[_id].id == _id);
        _;
    }

    function checkQuantity(
        ProductStorage storage self,
        uint _id,
        uint32 _quantity
    )
        internal
        view
        returns (bool)
    {
        return self.list[_id].quantity >= _quantity;
    }

    /**
    * @dev Create a new product.
    * @param self Reference to producr storage.
    * @param _name Produce name.
    * @param _price Product price.
    * @param _quantity The amount to be transferred.
    */
    function add(ProductStorage storage self, string _name, uint256 _price, uint32 _quantity)
        internal
        returns (uint256)
    {
        self.productCount = self.productCount.add(1);
        self.list[self.productCount] = Product(
            self.productCount,
            _name,
            _price,
            _quantity
        );
        emit ProductAdded(msg.sender, self.productCount, _name, _price, _quantity);
        return self.productCount;
    }

    /**
    * @dev Update product by id.
    * @param self Reference to producr storage.
    * @param _name Produce name.
    * @param _price Product price.
    * @param _quantity The amount to be transferred.
    */
    function edit(
        ProductStorage storage self,
        uint256 _id,
        string _name,
        uint256 _price,
        uint32 _quantity
    )
        inStorage(self, _id)
        internal
        returns (uint256)
    {

        self.list[_id].name = _name;
        self.list[_id].price = _price;
        self.list[_id].quantity = _quantity;

        emit ProductEdited(msg.sender, _id, _name, _price, _quantity);
        return _id;
    }

    /**
    * @dev Get product.
    * @param self Reference to product storage.
    * @param _id Product id.
    */
    function get(
        ProductStorage storage self,
        uint256 _id
    )
        inStorage(self, _id)
        view
        internal
        returns (uint256, string, uint256, uint32)
    {
        return (
            self.list[_id].id,
            self.list[_id].name,
            self.list[_id].price,
            self.list[_id].quantity
        );
    }

    /**
    * @dev Get product.
    * @param self Reference to product storage.
    */
    function getLastProductId(
        ProductStorage storage self
    )
        view
        internal
        returns (uint)
    {
        return self.productCount;
    }

    /**
    * @dev Decrease product quantity.
    * @param self Reference to product storage.
    * @param _id Product id.
    * @param _quantity The amount to be decreased.
    */
    function decreaseQuantity(
        ProductStorage storage self,
        uint256 _id,
        uint32 _quantity
    )
        inStorage(self, _id)
        internal
        returns (uint256)
    {
        require(self.list[_id].quantity >= _quantity);

        self.list[_id].quantity = uint32(self.list[_id].quantity.sub(_quantity));
        emit ProductQuantityDecreased(msg.sender, _id, _quantity);
        return _id;
    }

    /**
    * @dev Delete product.
    * @param self Reference to product storage.
    * @param _id Product id to delete.
    */
    function deleteProduct(ProductStorage storage self, uint _id)
        inStorage(self, _id)
        internal
        returns (bool)
    {
        delete self.list[_id];
        emit ProductDeleted(msg.sender, _id);
        return true;
    }

    event ProductAdded(
        address indexed actor,
        uint indexed id,
        string name,
        uint price,
        uint32 quantity
    );

    event ProductEdited(
        address indexed actor,
        uint indexed id,
        string name,
        uint price,
        uint32 quantity
    );

    event ProductQuantityDecreased(
        address indexed actor,
        uint indexed id,
        uint32 quantity
    );

    event ProductDeleted(address indexed actor, uint indexed id);
}
