pragma solidity ^0.4.24;

import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/lifecycle/Destructible.sol";
import "./ProductLib.sol";
import "./EntityLib.sol";
import "./Paginable.sol";

contract Shop is Ownable, Destructible, Paginable {
    using SafeMath for uint;
    using ProductLib for ProductLib.ProductStorage;
    using EntityLib for EntityLib.EntityStorage;

    string public name;
    string public description;
    bytes32 public constant ENTITY_NAME = "products";

    ProductLib.ProductStorage internal products;
    EntityLib.EntityStorage internal entities;

    modifier checkQuantity(uint64 _id, uint32 _quantity) {
        require(products.checkQuantity(_id, _quantity) == true);
        _;
    }

    constructor(string _name, string _description) public payable {
        name = _name;
        description = _description;
    }

    function addProduct(
        string _name,
        uint256 _price,
        uint32 _quantity,
        string _image
    )
        public
        onlyOwner
        returns (uint64)
    {
        uint64 id = products.add(_name, _price, _quantity, _image);
        entities.add(ENTITY_NAME, id);
        return id;
    }

    function editProduct(
        uint64 _id,
        string _name,
        uint256 _price,
        uint32 _quantity,
        string _image
    )
        public
        onlyOwner
        returns (uint)
    {
        return products.edit(_id, _name, _price, _quantity, _image);
    }

    function deleteProduct(uint64 _id) public onlyOwner returns (bool)
    {
        entities.remove(ENTITY_NAME, _id);
        return products.remove(_id);
    }

    function buyProduct(uint64 _id, uint32 _quantity)
        public
        checkQuantity(_id, _quantity)
        payable
        returns (uint64)
    {
        (,,uint price,,) = products.get(_id);
        uint total = price.mul(_quantity);

        require(total <= msg.value);
        products.decreaseQuantity(_id, _quantity);
        emit ProductSold(msg.sender, _id, _quantity, total);

        returnExtra(msg.value, total);
    }

    function getProduct(uint64 _id)
        public
        view
        returns (uint64, string, uint256, uint32, string)
    {
        return products.get(_id);
    }

    function getList(uint64 _from, uint16 _count)
        public
        view
        returns (uint64[])
    {
        if (_count > pageSize) {
            _count = pageSize;
        }
        return entities.getList(ENTITY_NAME, _from, _count);
    }

    function getProductCount() public view returns (uint64) {
        return products.getProductCount();
    }

    function getLastProductId() public view returns (uint64)
    {
        return products.getLastProductId();
    }

    function getNext(uint64 _id) public view returns (uint64) {
        return entities.getNextId(ENTITY_NAME, _id);
    }

    function getPrev(uint64 _id) public view returns (uint64) {
        return entities.getPrevId(ENTITY_NAME, _id);
    }

    function getFirst() public view returns (uint64) {
        return entities.getNextId(ENTITY_NAME, 0);
    }

    function getLast() public view returns (uint64) {
        return entities.getPrevId(ENTITY_NAME, 0);
    }

    function withdraw(uint value) public onlyOwner returns (bool) {
        require(value > address(this).balance);
        address(owner).transfer(value);
        return true;
    }

    function returnExtra(uint value, uint amount) private returns (bool) {
        if (value > amount) {
            msg.sender.transfer(value.sub(amount));
            return true;
        } else {
            return false;
        }
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

    event ProductSold(
        address indexed actor,
        uint64 indexed id,
        uint32 quantity,
        uint total
    );

    event PageSizeChanged(
        address indexed actor,
        uint16 indexed to,
        uint16 indexed from
    );

    event ProductDeleted(address indexed actor, uint64 indexed id);
}
