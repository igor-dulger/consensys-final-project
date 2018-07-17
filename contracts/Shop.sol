pragma solidity ^0.4.24;

/* import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/lifecycle/Destructible.sol'; */
import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/lifecycle/Destructible.sol";
import "./MarketplaceRoles.sol";
import "./ProductLib.sol";

contract Shop is Ownable, Destructible {
    using SafeMath for uint;
    using ProductLib for ProductLib.ProductStorage;

    ProductLib.ProductStorage products;

    modifier checkQuantity(uint _id, uint32 _quantity) {
        require(products.checkQuantity(_id, _quantity) == true);
        _;
    }

    function addProduct(string _name, uint256 _price, uint32 _quantity)
        onlyOwner
        public
        returns (uint)
    {
        return products.add(_name, _price, _quantity);
    }

    function editProduct(uint _id, string _name, uint256 _price, uint32 _quantity)
        onlyOwner
        public
        returns (uint)
    {
        return products.edit(_id, _name, _price, _quantity);
    }

    function returnExtra(uint value, uint amount) private returns (bool){
        if (value > amount) {
            msg.sender.transfer(value.sub(amount));
            return true;
        } else {
            return false;
        }
        
    }

    function buyProduct(uint _id, uint32 _quantity)
        payable
        checkQuantity(_id, _quantity)
        public
        returns (uint)
    {
        (,,uint price,) = products.get(_id);
        uint total = price.mul(_quantity);

        require(total <= msg.value);

        returnExtra(msg.value, total);

        products.decreaseQuantity(_id, _quantity);
        emit ProductSold(msg.sender, _id, _quantity, total);
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

    event ProductSold(
        address indexed actor,
        uint indexed id,
        uint32 quantity,
        uint total
    );

    event ProductDeleted(address indexed actor, uint indexed id);
}
