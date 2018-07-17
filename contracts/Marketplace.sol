pragma solidity ^0.4.24;
/*
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import "./MarketplaceRoles.sol";
*/

import "./openzeppelin/ownership/Ownable.sol";
import "./openzeppelin/math/SafeMath.sol";
import "./MarketplaceRoles.sol";

contract Marketplace is Ownable, MarketplaceRoles {
  using SafeMath for uint;

}
