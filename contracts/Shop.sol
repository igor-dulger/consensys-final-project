pragma solidity 0.4.24;

import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/lifecycle/Pausable.sol";
import "./openzeppelin/lifecycle/Destructible.sol";
import "./ProductLib.sol";
import "./EntityLib.sol";
//import "./Paginable.sol";


/**
 * @title Shop
 * @author Igor Dulger
 * @dev Stores products and provides functions for products managibg and selling.
 */
contract Shop is Ownable, Pausable, Destructible {
    using SafeMath for uint;
    using ProductLib for ProductLib.ProductStorage;
    using EntityLib for EntityLib.EntityStorage;

    string public name;
    string public description;
    bytes32 internal constant ENTITY_NAME = "products";

    ProductLib.ProductStorage internal products;
    EntityLib.EntityStorage internal entities;

    /**
     * @dev Contract constructor
     * @param _name Shop name
     * @param _description Shop description
     */
    constructor(string _name, string _description) public payable {
        name = _name;
        description = _description;
    }

    /**
     * @dev check if product quantity is enough
     * @param _id Product id
     * @param _quantity Expected quantity
     * // reverts
     */
    modifier checkQuantity(uint64 _id, uint32 _quantity) {
        require(
            products.checkQuantity(_id, _quantity) == true
        );
        _;
    }

    /**
    * @dev Create a new product.
    * @param _name Produce name.
    * @param _price Product price.
    * @param _quantity Product quantity.
    * @param _image IPFS hash of image.
    * @return uint
    * //reverts
    */
    function addProduct(
        string _name,
        uint256 _price,
        uint32 _quantity,
        string _image
    )
        external
        onlyOwner

        returns (uint64)
    {
        uint64 id = products.add(_name, _price, _quantity, _image);
        entities.add(ENTITY_NAME, id);
        return id;
    }

    /**
    * @dev Update product by id.
    * @param _name Produce name.
    * @param _price Product price.
    * @param _quantity Product quantity.
    * @param _image IPFS hash of image.
    * @return uint
    * //reverts
    */
    function editProduct(
        uint64 _id,
        string _name,
        uint256 _price,
        uint32 _quantity,
        string _image
    )
        external
        onlyOwner

        returns (uint)
    {
        return products.edit(_id, _name, _price, _quantity, _image);
    }

    /**
    * @dev Delete product.
    * @param _id Product id to delete.
    * @return uint
    * //reverts
    */
    function deleteProduct(uint64 _id)
        external
        onlyOwner

        returns (bool)
    {
        entities.remove(ENTITY_NAME, _id);
        return products.remove(_id);
    }

    /**
    * @dev Buy product.
    * @param _id Product id to buy.
    * @param _quantity How many items to buy.
    * @return uint
    * //reverts
    */
    function buyProduct(uint64 _id, uint32 _quantity)
        external
        whenNotPaused
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

    /**
    * @dev Get product.
    * @param _id Product id.
    * @return (uint64, string, uint256, uint32, string)
    */
    function getProduct(uint64 _id)
        external
        whenNotPaused
        view
        returns (uint64, string, uint256, uint32, string)
    {
        return products.get(_id);
    }

    /**
    * @dev Get list of product ids. If _from doesn't exist function will start
    * from a first existing product
    * @param _from Product id to start with.
    * @param _count How many products to return.
    * @return uint64[]
    */
    /* function getProducts(uint64 _from, uint16 _count)
        external
        whenNotPaused
        view
        returns (uint64[])
    {
        uint16 count = 0;
        if (_count > pageSize) {
            count = pageSize;
        } else {
            count = _count;
        }
        return entities.getList(ENTITY_NAME, _from, count);
    } */

    /**
    * @dev Get number of products in the storage.
    * @return uint64
    */
    function getProductCount() external  view returns (uint64) {
        return products.getProductCount();
    }

    /**
    * @dev Get last product id.
    * @return uint64
    */
    /* function getLastProductId() external  view returns (uint64)
    {
        return products.getLastProductId();
    } */


    /**
    * @dev next existing product
    * @param _id product id
    * @return (uint64, string, uint256, uint32, string)
    * //revert
    */

    function getNext(uint64 _id)
        public
        view
        returns(uint64, string, uint256, uint32, string)
    {
        return products.get(entities.getNextId(ENTITY_NAME, _id));
    }

    /**
    * @dev withdraw ether to the shop owner
    * @param value amount to withdraw.
    * @return bool
    * //revert
    */

    function withdraw(uint value) external onlyOwner   returns (bool) {
        require(value <= address(this).balance);
        address(owner).transfer(value);
        return true;
    }

    /**
    * @dev return extra money to a buyer
    * @param value how much money buyer sent.
    * @param amount how much money buyer spent.
    * @return bool
    */
    function returnExtra(uint value, uint amount) private returns (bool) {
        if (value > amount) {
            msg.sender.transfer(value.sub(amount));
            return true;
        } else {
            return false;
        }
    }

    /**
    * @dev Event for adding a product.
    * @param actor Who added product (Indexed).
    * @param id Product id (Indexed).
    * @param name Product name.
    * @param price Product price.
    * @param quantity Product quantity.
    */
    event ProductAdded(
        address indexed actor,
        uint64 indexed id,
        string name,
        uint price,
        uint32 quantity
    );

    /**
    * @dev Event for product editing.
    * @param actor Who edited product (Indexed).
    * @param id Product id (Indexed).
    * @param name Product name.
    * @param price Product price.
    * @param quantity Product quantity.
    */
    event ProductEdited(
        address indexed actor,
        uint64 indexed id,
        string name,
        uint price,
        uint32 quantity
    );

    /**
    * @dev Event for changing product quantity.
    * @param actor Who edited product (Indexed).
    * @param id Product id (Indexed).
    * @param quantity Product quantity.
    */
    event ProductQuantityDecreased(
        address indexed actor,
        uint64 indexed id,
        uint32 quantity
    );

    /**
    * @dev Event for product deleting.
    * @param actor Who deleted product (Indexed).
    * @param id Product id (Indexed).
    */
    event ProductDeleted(address indexed actor, uint64 indexed id);

    /**
    * @dev Event for product selling.
    * @param actor Who bought product (Indexed).
    * @param id Product id (Indexed).
    * @param quantity Product quantity.
    * @param total Total amount.
    */
    event ProductSold(
        address indexed actor,
        uint64 indexed id,
        uint32 quantity,
        uint total
    );
}
