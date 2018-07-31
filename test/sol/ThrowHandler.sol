pragma solidity ^0.4.20;

contract ThrowHandler {

    function execute(string signature) internal returns (bool){
        bytes4 sig = bytes4(keccak256(abi.encodePacked(signature)));
        address self = address(this);
        return self.call(sig);
    }

    function execute(address target, string signature) internal returns (bool){
        bytes4 sig = bytes4(keccak256(abi.encodePacked(signature)));
        address self = address(target);
        return self.call(sig);
    }
}
