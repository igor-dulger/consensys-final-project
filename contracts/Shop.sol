pragma solidity ^0.4.24;

/* import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Destructible.sol'; */
import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/lifecycle/Destructible.sol";
import "./MarketplaceRoles.sol";
import "./ProductLib.sol";

contract Shop is Ownable, MarketplaceRoles, Destructible {
    using SafeMath for uint;
    using ProductLib for ProductLib.ProductStorage;

    ProductLib.ProductStorage products;

    function addProduct(string _name, uint256 _price, uint32 _quantity)
        onlyOwner
        public
        returns (uint)
    {
        return products.add(_name, _price, _quantity);
    }

    function getProduct(uint256 _id)
        public
        view
        returns (uint256, string, uint256, uint32)
    {
        return products.get(_id);
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
