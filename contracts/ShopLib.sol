pragma solidity 0.4.24;

import "./openzeppelin/math/SafeMath.sol";

/**
 * @title ShopLib
 * @author Igor Dulger
 * @dev Handle shop data type (CRUD)
 */
library ShopLib {
    using SafeMath for uint32;
    using SafeMath for uint64;
    using SafeMath for uint;

    struct Shop {
        uint64 id;
        string name;
        string description;
        address shopAddress;
        address owner;
    }

    struct ShopStorage {
        uint64 maxId;
        uint64 count;
        mapping (uint64 => Shop) entities;
    }

    /**
    * @dev Check if a entity exists in the storage
    * @param self Reference to entity storage.
    * @param _id Produce id.
    */

    modifier inStorage(ShopStorage storage self, uint64 _id) {
        require(_id != 0 && self.entities[_id].id == _id);
        _;
    }

    /**
    * @dev Create a new shop.
    * @param self Reference to entity storage.
    * @param _name Shop name.
    * @param _description Shop description.
    * @param _shopAddress Shop address.
    * @param _owner Shop owner.
    * @return uint64
    */
    function add(
        ShopStorage storage self,
        string _name,
        string _description,
        address _shopAddress,
        address _owner
    )
        internal
        returns (uint64)
    {
        self.maxId = uint64(self.maxId.add(1));
        self.count = uint64(self.count.add(1));

        self.entities[self.maxId] = Shop(
            self.maxId,
            _name,
            _description,
            _shopAddress,
            _owner
        );

        emit ShopAdded(msg.sender, self.maxId, _name, _shopAddress, _owner);
        return self.maxId;
    }

    /**
    * @dev Get shop.
    * @param self Reference to entity storage.
    * @param _id entity id.
    * @return uint64, string, string, address, address
    * //revert
    */
    function get(
        ShopStorage storage self,
        uint64 _id
    )
        internal
        inStorage(self, _id)
        view
        returns (uint64, string, string, address, address)
    {
        return (
            self.entities[_id].id,
            self.entities[_id].name,
            self.entities[_id].description,
            self.entities[_id].shopAddress,
            self.entities[_id].owner
        );
    }

    /**
    * @dev Get product.
    * @param self Reference to entity storage.
    */
    function getCount(
        ShopStorage storage self
    )
        internal
        view
        returns (uint64)
    {
        return self.count;
    }

    /**
    * @dev Delete shop
    * @param self Reference to entity storage.
    * @param _id entity id to delete.
    */
    function remove(ShopStorage storage self, uint64 _id)
        internal
        inStorage(self, _id)
        returns (bool)
    {
        delete self.entities[_id];
        self.count = uint64(self.count.sub(1));
        emit ShopDeleted(msg.sender, _id);
        return true;
    }

    /**
    * @dev Event for shop adding.
    * @param actor Who added shop (Indexed).
    * @param id Shop id (Indexed).
    * @param name Shop name.
    * @param shopAddress Address of shop contract.
    * @param owner Shop owner.
    */
    event ShopAdded(
        address indexed actor,
        uint64 indexed id,
        string name,
        address indexed shopAddress,
        address owner
    );

    /**
    * @dev Event for shop deleting.
    * @param actor Who deleted shop (Indexed).
    * @param id shop id (Indexed).
    */
    event ShopDeleted(address indexed actor, uint64 indexed id);
}
