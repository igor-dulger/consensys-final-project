pragma solidity ^0.4.24;

import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/math/SafeMath.sol";
import "./MarketplaceRoles.sol";
import "./EntityList.sol";

contract Marketplace is Ownable, MarketplaceRoles, EntityList {
  using SafeMath for uint;

}
