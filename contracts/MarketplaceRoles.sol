pragma solidity ^0.4.24;

import './openzeppelin/ownership/Ownable.sol';
import './openzeppelin/math/SafeMath.sol';
import "./openzeppelin/ownership/rbac/RBAC.sol";

/**
 * @title Superuser
 * @author Igor Dulger
 * @dev The Superuser contract defines a single superuser who can transfer the ownership
 * of a contract to a new address, even if he is not the owner.
 * A superuser can transfer his role to a new address.
 */
contract MarketplaceRoles is Ownable, RBAC {
    string public constant ROLE_ADMIN = "admin";
    string public constant ROLE_SELLER = "seller";

    /**
    * @dev Throws if called by any account that's not a admin.
    */
    modifier onlyAdmin() {
        checkRole(msg.sender, ROLE_ADMIN);
        _;
    }

    /**
    * @dev Throws if called by any account that's not a shop owner.
    * @return bool
    */
    modifier onlySeller() {
        checkRole(msg.sender, ROLE_SELLER);
        _;
    }

    /**
    * @dev Throws if called by any account that's not an admin or owner.
    * @return bool
    */
    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || isAdmin(msg.sender));
        _;
    }

    /**
    * @dev getter to determine if address has admin role
    * @param _addr account address
    * @return bool
    */
    function isAdmin(address _addr)
        public
        view
        returns (bool)
    {
        return hasRole(_addr, ROLE_ADMIN);
    }

    /**
    * @dev getter to determine if address has shop owner role
    * @param _addr account address
    * @return bool
    */
    function isSeller(address _addr)
        public
        view
        returns (bool)
    {
        return hasRole(_addr, ROLE_SELLER);
    }

}
