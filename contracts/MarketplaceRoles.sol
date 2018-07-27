pragma solidity ^0.4.24;

/* import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import "openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol"; */

import './openzeppelin/ownership/Ownable.sol';
import './openzeppelin/math/SafeMath.sol';
import "./openzeppelin/ownership/rbac/RBAC.sol";

/**
 * @title Superuser
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
   */
  modifier onlySeller() {
    checkRole(msg.sender, ROLE_SELLER);
    _;
  }

  /**
   * @dev Throws if called by any account that's not an admin or owner.
   */
  modifier onlyOwnerOrAdmin() {
    require(msg.sender == owner || isAdmin(msg.sender));
    _;
  }

  /**
   * @dev getter to determine if address has admin role
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
   */
  function isSeller(address _addr)
    public
    view
    returns (bool)
  {
    return hasRole(_addr, ROLE_SELLER);
  }

}
