pragma solidity ^0.4.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MarketplaceRoles.sol";
import "./RequireProxy.sol";
import "./ThrowHandler.sol";

contract TestMarketPlaceRoles is MarketplaceRoles, ThrowHandler {

    function checkOnlyAdminModifier() public onlyAdmin view {
    }

    function checkOnlySellerModifier() public onlySeller view {
    }

    function checkOnlyOwnerOrAdminModifier()
        public
        onlyOwnerOrAdmin
        view
    {
    }

    function testIsAdmin() public {

        Assert.isFalse(isAdmin(msg.sender), "sender isn't admin");

        addRole(msg.sender, ROLE_ADMIN);

        Assert.isTrue(isAdmin(msg.sender), "sender is admin");
    }

    function testIsSeller() public {

        Assert.isFalse(isSeller(msg.sender), "sender isn't seller");

        addRole(msg.sender, ROLE_SELLER);

        Assert.isTrue(isSeller(msg.sender), "sender should be seller");
    }

    function testOnlyAdminModifier() public {
        removeRole(address(this), ROLE_ADMIN);

        Assert.isFalse(execute('checkOnlyAdminModifier()'), "expected revert, sender isn't admin");

        addRole(address(this), ROLE_ADMIN);

        Assert.isTrue(execute('checkOnlyAdminModifier()'), "expected true, sender is admin");
    }

    function testOnlySellerModifier() public {
        removeRole(address(this), ROLE_SELLER);

        Assert.isFalse(execute('checkOnlySellerModifier()'), "expected revert, sender isn't admin");

        addRole(address(this), ROLE_SELLER);

        Assert.isTrue(execute('checkOnlySellerModifier()'), "expected true, sender is admin");
    }

    function testOnlyOwnerOrAdminModifier() public {
        removeRole(address(this), ROLE_ADMIN);
        Assert.isFalse(execute('checkOnlyOwnerOrAdminModifier()'), "expected revert, sender isn't admin");

        addRole(address(this), ROLE_ADMIN);
        Assert.isTrue(execute('checkOnlyOwnerOrAdminModifier()'), "expected true, sender is admin");

        removeRole(address(this), ROLE_ADMIN);
        owner = address(this);
        Assert.isTrue(execute('checkOnlyOwnerOrAdminModifier()'), "expected revert, sender isn't admin");
    }
}
