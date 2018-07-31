pragma solidity ^0.4.24;

import "./openzeppelin/ownership/Ownable.sol";

/**
 * @title Paginable
 * @author Igor Dulger
 * @dev Handle setters and getters for page size
 */
contract Paginable is Ownable {

    uint16 internal pageSize;

    constructor() public payable {
        pageSize = 10;
    }

    /**
    * @dev Set page size for listing.
    * @param _size Max number of items in a list
    */
    function setPageSize(uint16 _size)
        public
        onlyOwner
    {
        require(_size <= 100);
        require(_size > 0);
        emit PageSizeChanged(msg.sender, _size, pageSize);
        pageSize = _size;
    }

    /**
    * @dev Get page size for listing.
    * @return Max allowed number of items in a list
    */
    function getPageSize()
        public
        view
        returns (uint16)
    {
        return pageSize;
    }

    /**
    * @dev Event for page size editing.
    * @param actor Who changed page size (Indexed).
    * @param to New size (Indexed).
    * @param from Old size (Indexed).
    */
    event PageSizeChanged(
        address indexed actor,
        uint16 indexed to,
        uint16 indexed from
    );
}
