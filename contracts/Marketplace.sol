pragma solidity ^0.4.24;

import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/math/SafeMath.sol";
import "./MarketplaceRoles.sol";
import "./EntityLib.sol";
import "./ShopLib.sol";
import "./Shop.sol";

contract Marketplace is Ownable, MarketplaceRoles, Paginable {
    using SafeMath for uint;
    using ShopLib for ShopLib.ShopStorage;
    using EntityLib for EntityLib.EntityStorage;

    bytes32 public constant SHOPS_LIST = "shops";

    ShopLib.ShopStorage internal shops;
    EntityLib.EntityStorage internal entities;

    function addAdmin(address _addr) public onlyOwner returns(bool) {
        addRole(_addr, ROLE_ADMIN);
        return true;
    }

    function removeAdmin(address _addr) public onlyOwner returns(bool) {
        removeRole(_addr, ROLE_ADMIN);
        return true;
    }

    function addSeller(address _addr) public onlyOwnerOrAdmin returns(bool) {
        addRole(_addr, ROLE_SELLER);
        return true;
    }

    function removeSeller(address _addr) public onlyOwnerOrAdmin returns(bool) {
        removeRole(_addr, ROLE_SELLER);
        return true;
    }

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

    function deleteShop(uint64 _id)
        public
        onlySeller
        returns(bool)
    {
        (uint64 id, , , , address shopOwner) = shops.get(_id);
        require(id == _id);
        require(shopOwner == msg.sender);
        entities.remove(SHOPS_LIST, id);
        entities.remove(getShopListName(msg.sender), id);
        return true;
    }

    function getShop(uint64 _id)
        public
        view
        returns (uint64, string, string, address, address)
    {
        return shops.get(_id);
    }

    function getShops(uint64 _from, uint16 _count)
        public
        view
        returns (uint64[])
    {
        if (_count > pageSize) {
            _count = pageSize;
        }
        return entities.getList(SHOPS_LIST, _from, _count);
    }

    function getShops(address _seller, uint64 _from, uint16 _count)
        public
        view
        returns (uint64[])
    {
        if (_count > pageSize) {
            _count = pageSize;
        }
        return entities.getList(getShopListName(_seller), _from, _count);
    }

    function getShopListName(address _addr)
        private
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(SHOPS_LIST, _addr));
    }

}
