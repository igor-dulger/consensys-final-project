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
        uint price;
        uint32 quantity;
    }

    struct ProductStorage {
        uint productMaxId;
        uint productCount;
        mapping (uint => Product) list;
        uint16 pageSize;
    }


    /**
    * @dev Check if a product exists in the storage
    * @param self Reference to producr storage.
    * @param _id Produce id.
    */

    modifier inStorage(ProductStorage storage self, uint _id) {
        require(self.list[_id].id == _id);
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
        return self.list[_id].quantity >= _quantity;
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
        self.productMaxId = self.productMaxId.add(1);
        self.productCount = self.productCount.add(1);

        self.list[self.productMaxId] = Product(
            self.productMaxId,
            _name,
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
        Product storage product = self.list[_id];

        product.name = _name;
        product.price = _price;
        product.quantity = _quantity;

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
    * @param _from Starting id to get.
    * @param _to End id to get.
    */
    function getList(
        ProductStorage storage self,
        uint _from,
        uint _to
    )
        view
        internal
        returns (uint[])
    {
        require(_from < _to);
        uint to = _to;

        if (_to > self.productMaxId) {
            to = self.productMaxId;
        }

        uint listSize = to.sub(_from).add(1);

        if (listSize > self.pageSize) {
            to = _from.add(self.pageSize-1);
            listSize = self.pageSize;
        }
        uint[] memory result = new uint[](listSize);
        uint counter = 0;
        for (uint i = _from; i <= to; i++) {
            if (self.list[i].id != 0) {
                result[counter] = i;
                counter++;
            }
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
    function destroy(ProductStorage storage self, uint _id)
        inStorage(self, _id)
        internal
        returns (bool)
    {
        delete self.list[_id];
        self.productCount = self.productCount.sub(1);
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

    event PageSizeChanged(
        address indexed actor,
        uint16 indexed to,
        uint16 indexed from
    );

    event ProductDeleted(address indexed actor, uint indexed id);
}
