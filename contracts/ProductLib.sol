pragma solidity ^0.4.24;

import './openzeppelin/math/SafeMath.sol';

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library ProductLib {
    using SafeMath for uint32;
    using SafeMath for uint64;
    using SafeMath for uint;

    struct Product {
        uint64 id;
        string name;
        /*
        we can store image IPFS hash as
            struct Multihash {
              bytes32 hash
              uint8 hash_function
              uint8 size
            }, and use b58encode/decode,
        for simplisity in this project I used string
        */
        string image;
        uint price;
        uint32 quantity;
    }

    struct ProductStorage {
        uint64 productMaxId;
        uint64 productCount;
        mapping (uint64 => Product) entities;
    }

    /**
    * @dev Check if a product exists in the storage
    * @param self Reference to producr storage.
    * @param _id Produce id.
    */

    modifier inStorage(ProductStorage storage self, uint64 _id) {
        require(self.entities[_id].id == _id);
        _;
    }

    /**
    * @dev Check if a product has enough quantity.
    * @param self Reference to producr storage.
    * @param _id product Id.
    * @param _quantity The amount to checked.
    */
    function checkQuantity(
        ProductStorage storage self,
        uint64 _id,
        uint32 _quantity
    )
        internal
        view
        returns (bool)
    {
        return self.entities[_id].quantity >= _quantity;
    }

    /**
    * @dev Create a new product.
    * @param self Reference to producr storage.
    * @param _name Produce name.
    * @param _price Product price.
    * @param _quantity The amount to be transferred.
    * @param _image IPFS hash of image.
    */
    function add(
        ProductStorage storage self,
        string _name,
        uint256 _price,
        uint32 _quantity,
        string _image
    )
        internal
        returns (uint64)
    {
        self.productMaxId = uint64(self.productMaxId.add(1));
        self.productCount = uint64(self.productCount.add(1));

        self.entities[self.productMaxId] = Product(
            self.productMaxId,
            _name,
            _image,
            _price,
            _quantity
        );

        emit ProductAdded(msg.sender, self.productMaxId, _name, _price, _quantity);
        return self.productMaxId;
    }

    /**
    * @dev Update product by id.
    * @param self Reference to producr storage.
    * @param _name Produce name.
    * @param _price Product price.
    * @param _quantity The amount to be transferred.
    * @param _image IPFS hash of image.
    */
    function edit(
        ProductStorage storage self,
        uint64 _id,
        string _name,
        uint256 _price,
        uint32 _quantity,
        string _image
    )
        internal
        inStorage(self, _id)
        returns (uint64)
    {
        Product storage product = self.entities[_id];

        product.name = _name;
        product.price = _price;
        product.quantity = _quantity;
        if (bytes(_image).length > 0) {
            product.image = _image;
        }

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
        uint64 _id
    )
        internal
        inStorage(self, _id)
        view
        returns (uint64, string, uint256, uint32, string)
    {
        return (
            self.entities[_id].id,
            self.entities[_id].name,
            self.entities[_id].price,
            self.entities[_id].quantity,
            self.entities[_id].image
        );
    }

    /**
    * @dev Get product.
    * @param self Reference to product storage.
    */
    function getLastProductId(
        ProductStorage storage self
    )
        internal
        view
        returns (uint64)
    {
        return self.productMaxId;
    }

    /**
    * @dev Get product.
    * @param self Reference to product storage.
    */
    function getProductCount(
        ProductStorage storage self
    )
        internal
        view
        returns (uint64)
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
        uint64 _id,
        uint32 _quantity
    )
        internal
        inStorage(self, _id)
        returns (uint64)
    {
        require(self.entities[_id].quantity >= _quantity);

        self.entities[_id].quantity = uint32(
            self.entities[_id].quantity.sub(_quantity)
        );
        emit ProductQuantityDecreased(msg.sender, _id, _quantity);
        return _id;
    }

    /**
    * @dev Delete product.
    * @param self Reference to product storage.
    * @param _id Product id to delete.
    */
    function remove(ProductStorage storage self, uint64 _id)
        internal
        inStorage(self, _id)
        returns (bool)
    {
        delete self.entities[_id];
        self.productCount = uint64(self.productCount.sub(1));
        emit ProductDeleted(msg.sender, _id);
        return true;
    }

    event ProductAdded(
        address indexed actor,
        uint64 indexed id,
        string name,
        uint price,
        uint32 quantity
    );

    event ProductEdited(
        address indexed actor,
        uint64 indexed id,
        string name,
        uint price,
        uint32 quantity
    );

    event ProductQuantityDecreased(
        address indexed actor,
        uint64 indexed id,
        uint32 quantity
    );

    event ProductDeleted(address indexed actor, uint64 indexed id);
}
