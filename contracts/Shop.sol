pragma solidity ^0.4.24;

import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/lifecycle/Destructible.sol";
import "./ProductLib.sol";
import "./EntityList.sol";

contract Shop is Ownable, Destructible,EntityList {
    using SafeMath for uint;
    using ProductLib for ProductLib.ProductStorage;
    string public name;
    string public description;

    ProductLib.ProductStorage internal products;

    modifier checkQuantity(uint _id, uint32 _quantity) {
        require(products.checkQuantity(_id, _quantity) == true);
        _;
    }

    constructor(string _name, string _description) public {
        name = _name;
        description = _description;
        products.setPageSize(100);
    }

    function addProduct(string _name, uint256 _price, uint32 _quantity, string _image)
        public
        onlyOwner
        returns (uint)
    {
        return products.add(_name, _price, _quantity, _image);
    }

    function editProduct(uint _id, string _name, uint256 _price, uint32 _quantity, string _image)
        public
        onlyOwner
        returns (uint)
    {
        return products.edit(_id, _name, _price, _quantity, _image);
    }

    function deleteProduct(uint _id)
        public
        onlyOwner
        returns (bool)
    {
        return products.destroy(_id);
    }

    function setPageSize(uint16 _size)
        public
        onlyOwner
    {
        products.setPageSize(_size);
    }

    function getPageSize()
        public
        view
        returns (uint16)
    {
        return products.getPageSize();
    }


    function buyProduct(uint _id, uint32 _quantity)
        public
        payable
        checkQuantity(_id, _quantity)
        returns (uint)
    {
        (,,uint price,,) = products.get(_id);
        uint total = price.mul(_quantity);

        require(total <= msg.value);
        products.decreaseQuantity(_id, _quantity);
        emit ProductSold(msg.sender, _id, _quantity, total);

        returnExtra(msg.value, total);
    }

    function getProduct(uint256 _id)
        public
        view
        returns (uint256, string, uint256, uint32, string)
    {
        return products.get(_id);
    }

    function getList(uint256 _from, uint _count)
        public
        view
        returns (uint[])
    {
        return products.getList(_from, _count);
    }

    function getProductCount()
        view
        public
        returns (uint)
    {
        return products.getProductCount();
    }

    function getLastProductId()
        view
        public
        returns (uint)
    {
        return products.getLastProductId();
    }

    function returnExtra(uint value, uint amount)
        private
        returns (bool)
    {
        if (value > amount) {
            msg.sender.transfer(value.sub(amount));
            return true;
        } else {
            return false;
        }
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

    event PageSizeChanged(
        address indexed actor,
        uint16 indexed to,
        uint16 indexed from
    );

    event ProductDeleted(address indexed actor, uint indexed id);
}
