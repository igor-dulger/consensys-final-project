pragma solidity 0.4.24;

import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/math/SafeMath.sol";
import "./MarketplaceRoles.sol";
import "./EntityLib.sol";
import "./ShopLib.sol";
import "./Shop.sol";

/**
 * @title Marketplace
 * @author Igor Dulger
 * @dev Factory of shops with roles management.
 */
contract Marketplace is Ownable, MarketplaceRoles {
    using SafeMath for uint;
    using ShopLib for ShopLib.ShopStorage;
    using EntityLib for EntityLib.EntityStorage;

    bytes32 internal constant SHOPS_LIST = "shops";

    ShopLib.ShopStorage internal shops;
    EntityLib.EntityStorage internal entities;

    /**
    * @dev Add admin role to an address.
    * @param _addr account address
    * @return bool
    * //revert
    */
    function addAdmin(address _addr) public onlyOwner returns(bool) {
        addRole(_addr, ROLE_ADMIN);
        return true;
    }

    /**
    * @dev Remove admin role from an address.
    * @param _addr account address
    * @return bool
    * //revert
    */
    function removeAdmin(address _addr) public onlyOwner returns(bool) {
        removeRole(_addr, ROLE_ADMIN);
        return true;
    }

    /**
    * @dev Add seller role to an address.
    * @param _addr account address
    * @return bool
    * //revert
    */
    function addSeller(address _addr)
        public
        onlyOwnerOrAdmin

        returns(bool)
    {
        addRole(_addr, ROLE_SELLER);
        return true;
    }

    /**
    * @dev Remove seller role from an address.
    * @param _addr account address
    * @return bool
    * //revert
    */
    function removeSeller(address _addr)
        public
        onlyOwnerOrAdmin

        returns(bool)
    {
        removeRole(_addr, ROLE_SELLER);
        return true;
    }

    /**
    * @dev Create a new shop.
    * @param _name Shop name.
    * @param _description Shop description.
    * @return bool
    * //revert
    */
    function createShop(string _name, string _description)
        public
        onlySeller

        returns(bool)
    {
        Shop shop = new Shop(_name, _description);
        shop.transferOwnership(address(msg.sender));
        uint64 id = shops.add(_name, _description, address(shop), msg.sender);
        entities.add(SHOPS_LIST, id);
        entities.add(getShopListName(msg.sender), id);
        return true;
    }

    /**
    * @dev Delete shop
    * @param _id shop id to delete.
    * @return bool
    * //revert
    */
    function deleteShop(uint64 _id)
        public
        onlySeller

        returns(bool)
    {
        (uint64 id, , , , address shopOwner) = shops.get(_id);
        require(id == _id);
        require(shopOwner == msg.sender);
        shops.remove(_id);
        entities.remove(SHOPS_LIST, id);
        entities.remove(getShopListName(msg.sender), id);
        return true;
    }

    /**
    * @dev Get shop.
    * @param _id shop id.
    * @return uint64, string, string, address, address
    * //revert
    */
    function getShop(uint64 _id)
        public

        view
        returns(uint64 id, string name, string description, address shop, address owner)
    {
        return shops.get(_id);
    }

    /**
    * @dev next shop product
    * @param _id product id
    * @return (uint64 id, string name, string description, address shop, address owner)
    * //revert
    */

    function getNext(uint64 _id)
        public
        view
        returns(uint64 id, string name, string description, address shop, address owner)
    {
        return shops.get(entities.getNextId(SHOPS_LIST, _id));
    }

    /**
    * @dev next shop product
    * @param _id product id
    * @return (uint64 id, string name, string description, address shop, address owner)
    * //revert
    */

    function getSellersNext(address _seller, uint64 _id)
        public
        view
        returns(uint64 id, string name, string description, address shop, address owner)
    {
        return shops.get(entities.getNextId(getShopListName(_seller), _id));
    }
    /**
    * @dev Get list of shop ids. If _from doesn't exist function will start
    * from a first existing shop
    * @param _from shop id to start with.
    * @param _count How many shops to return.
    * @return uint64[]
    */
    /* function getShops(uint64 _from, uint16 _count)
        public

        view
        returns (uint64[])
    {
        if (_count > pageSize) {
            _count = pageSize;
        }
        return entities.getList(SHOPS_LIST, _from, _count);
    } */

    /**
    * @dev Get list of shop ids owned by a seller. If _from doesn't exist function will start
    * from a first existing shop
    * @param _seller seller address.
    * @param _from shop id to start with.
    * @param _count How many shops to return.
    * @return uint64[]
    */
    /* function getSellerShops(address _seller, uint64 _from, uint16 _count)
        public

        view
        returns (uint64[])
    {
        if (_count > pageSize) {
            _count = pageSize;
        }
        return entities.getList(getShopListName(_seller), _from, _count);
    } */

    /**
    * @dev Generate key for mapping which stores shop ids by sellers
    * @param _addr seller address.
    * @return bytes32
    */
    function getShopListName(address _addr)
        private
        view
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(SHOPS_LIST, _addr));
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
