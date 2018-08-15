pragma solidity 0.4.24;

import "./Shop.sol";

/**
 * @title ShopFactoryLib
 * @author Igor Dulger
 * @dev Create an instance of shop
 */
library ShopFactoryLib {

    /**
    * @dev Create a new shop.
    * @param _name Shop name.
    * @param _description Shop description.
    * @return address
    */
    function create(string _name, string _description)
        external
        returns (address)
    {
        Shop shop = new Shop(_name, _description);
        shop.transferOwnership(address(msg.sender));
        return address(shop);
    }
}
