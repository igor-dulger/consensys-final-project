pragma solidity ^0.4.24;

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
        uint productMaxId;
        uint productCount;
        mapping (bytes32 => Product) entities;
        mapping (bytes32 => uint) links;
        uint16 pageSize;
    }

    /**
    * @dev Check if a product exists in the storage
    * @param self Reference to producr storage.
    * @param _id Produce id.
    */

    modifier inStorage(ProductStorage storage self, uint _id) {
        require(self.entities[getEntityKey(_id)].id == _id);
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
        uint _id,
        uint32 _quantity
    )
        internal
        view
        returns (bool)
    {
        return self.entities[getEntityKey(_id)].quantity >= _quantity;
    }

    /**
    * @dev Set page size for listing.
    * @param self Reference to producr storage.
    * @param _size Max number of items in a list
    */
    function setPageSize(ProductStorage storage self, uint16 _size)
        internal
    {
        emit PageSizeChanged(msg.sender, _size, self.pageSize);
        self.pageSize = _size;
    }

    /**
    * @dev Get page size for listing.
    * @param self Reference to producr storage.
    * @return Max number of items in a list
    */
    function getPageSize(ProductStorage storage self)
        internal
        view
        returns(uint16)
    {
        return self.pageSize;
    }

//sha3("Voting", userAddress, pollCloseTime, "secrets", pollId, "secret") => bytes32 secret

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
        returns (uint256)
    {
        self.productMaxId = self.productMaxId.add(1);
        self.productCount = self.productCount.add(1);

        self.entities[getEntityKey(self.productMaxId)] = Product(
            self.productMaxId,
            _name,
            _image,
            _price,
            _quantity
        );

        self.links[getPrevKey(self.productMaxId)] = self.links[getPrevKey(0)];
        self.links[getNextKey(self.links[getPrevKey(0)])] = self.productMaxId;
        self.links[getPrevKey(0)] = self.productMaxId;

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
        uint256 _id,
        string _name,
        uint256 _price,
        uint32 _quantity,
        string _image
    )
        inStorage(self, _id)
        internal
        returns (uint256)
    {
        Product storage product = self.entities[getEntityKey(_id)];

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
        uint256 _id
    )
        inStorage(self, _id)
        view
        internal
        returns (uint256, string, uint256, uint32, string)
    {
        return (
            self.entities[getEntityKey(_id)].id,
            self.entities[getEntityKey(_id)].name,
            self.entities[getEntityKey(_id)].price,
            self.entities[getEntityKey(_id)].quantity,
            self.entities[getEntityKey(_id)].image
        );
    }

    /**
    * @dev Get a page of products, returns all existing ids from _from  but no more than count
    * @param self Reference to product storage.
    * @param _from Starting id to get.
    * @param _count End id to get.
    */
    function getList(
        ProductStorage storage self,
        uint _from,
        uint _count
    )
        view
        internal
        returns (uint[])
    {
        uint[] memory result;

        if (_count > self.pageSize) {
            _count = self.pageSize;
        }

        if (self.entities[getEntityKey(_from)].id != _from) {
            _from = self.links[getNextKey(0)];
        }

        uint counter = 0;
        uint current = _from;

        while (self.entities[getEntityKey(current)].id != 0 && counter < _count) {
            current = self.links[getNextKey(current)];
            counter++;
        }

        result = new uint[](counter);

        counter = 0;
        current = _from;
        while (self.entities[getEntityKey(current)].id != 0 && counter < _count) {
            result[counter] = current;
            current = self.links[getNextKey(current)];
            counter++;
        }

        return result;
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
        return self.productMaxId;
    }

    /**
    * @dev Get product.
    * @param self Reference to product storage.
    */
    function getProductCount(
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
        require(self.entities[getEntityKey(_id)].quantity >= _quantity);

        self.entities[getEntityKey(_id)].quantity = uint32(
            self.entities[getEntityKey(_id)].quantity.sub(_quantity)
        );
        emit ProductQuantityDecreased(msg.sender, _id, _quantity);
        return _id;
    }

    /**
    * @dev Delete product.
    * @param self Reference to product storage.
    * @param _id Product id to delete.
    */
    function destroy(ProductStorage storage self, uint _id)
        inStorage(self, _id)
        internal
        returns (bool)
    {
        delete self.entities[getEntityKey(_id)];
        self.productCount = self.productCount.sub(1);
        uint prev_id = self.links[getPrevKey(_id)];
        uint next_id = self.links[getNextKey(_id)];

        self.links[getNextKey(prev_id)] = next_id;
        self.links[getPrevKey(next_id)] = prev_id;

        delete self.links[getPrevKey(_id)];
        delete self.links[getNextKey(_id)];

        emit ProductDeleted(msg.sender, _id);
        return true;
    }

    /**
    * @dev Get key for an entity
    * @param _id Product id
    * @return byte32 hash
    */
    function getEntityKey(uint _id) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked("values",_id));
    }

    /**
    * @dev Get key for next link of entity list
    * @param _id Product id
    * @return byte32 hash
    */
    function getNextKey(uint _id) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked("next",_id));
    }

    /**
    * @dev Get key for prev link of entity list
    * @param _id Product id
    * @return byte32 hash    
    */
    function getPrevKey(uint _id) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked("prev",_id));
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

    event PageSizeChanged(
        address indexed actor,
        uint16 indexed to,
        uint16 indexed from
    );

    event ProductDeleted(address indexed actor, uint indexed id);
}
