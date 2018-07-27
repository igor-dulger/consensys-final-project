pragma solidity ^0.4.24;

/**
 * @title EntityList
 * @dev Handle a set of lists of any entities as a double linked lists turned into a circle
 */
contract EntityList {

    mapping (bytes32 => uint64) private entityLists;

    /**
    * @dev Check that 0 reserved ID wasn't used
    * @param _key Entity key.
    */
    modifier validKey(uint64 _key) {
        require(_key != 0);
        _;
    }

    /**
    * @dev Check that id is new in the list
    * @param _key Entity key.
    */
    modifier newKey(bytes32 _entityName, uint64 _key) {
        require(getId(_entityName, _key) == 0);
        _;
    }

    /**
    * @dev Check if key exists in the list
    * @param _key Entity key.
    */
    modifier existingKey(bytes32 _entityName, uint64 _key) {
        require(getId(_entityName, _key) == _key);
        _;
    }

    /**
    * @dev Add entity to a list
    * @param _entityName Name of entity.
    * @param _key entity key
    */
    function addEntity(bytes32 _entityName, uint64 _key)
        validKey(_key)
        newKey(_entityName, _key)
        internal
        returns (bool)
    {
        entityLists[getIdKey(_entityName, _key)] = _key;

        entityLists[getPrevKey(_entityName, _key)] = getPrevId(_entityName, 0);
        entityLists[getNextKey(_entityName, getPrevId(_entityName, 0))] = _key;
        entityLists[getPrevKey(_entityName, 0)] = _key;

        return true;
    }

    /**
    * @dev Delete entity from list.
    * @param _entityName Name of entity.
    * @param _key entity key
    */
    function deleteEntity(bytes32 _entityName, uint64 _key)
        validKey(_key)
        existingKey(_entityName, _key)
        internal
        returns (bool)
    {
        uint64 prev = getPrevId(_entityName, _key);
        uint64 next = getNextId(_entityName, _key);

        entityLists[getNextKey(_entityName, prev)] = next;
        entityLists[getPrevKey(_entityName, next)] = prev;

        delete entityLists[getIdKey(_entityName, _key)];
        delete entityLists[getPrevKey(_entityName, _key)];
        delete entityLists[getNextKey(_entityName, _key)];

        return true;
    }

    /**
    * @dev Get a list of keys from entity list by a name of entity, returns
    * @dev all existing keys from _from  but no more than count
    * @param _entityName Name of entity.
    * @param _from Starting id to get.
    * @param _count End id to get.
    */
    function getList(bytes32 _entityName, uint64 _from, uint _count)
        view
        internal
        returns (uint64[])
    {
        uint64[] memory result;

        if (getId(_entityName, _from) == 0) {
            _from = getNextId(_entityName, 0);
        }

        uint64 counter = 0;
        uint64 current = _from;

        while (current != 0 && counter < _count) {
            current = getNextId(_entityName, current);
            counter++;
        }

        result = new uint64[](counter);

        counter = 0;
        current = _from;
        while (current != 0 && counter < _count) {
            result[counter] = current;
            current = getNextId(_entityName, current);
            counter++;
        }

        return result;
    }

    /**
    * @dev Get id from mapping
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return byte32 hash
    */
    function getId(bytes32 _entityName, uint64 _key)
        internal
        view
        returns(uint64)
    {
        return entityLists[getIdKey(_entityName, _key)];
    }

    /**
    * @dev Get mapping key for id
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return byte32 hash
    */
    function getIdKey(bytes32 _entityName, uint64 _key)
        internal
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(_entityName, "id", _key));
    }

    /**
    * @dev Get key for next link of entity list
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return byte32 hash
    */
    function getNextKey(bytes32 _entityName, uint64 _key)
        internal
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(_entityName, "next", _key));
    }

    /**
    * @dev Get id of next entity
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return byte32 hash
    */
    function getNextId(bytes32 _entityName, uint64 _key)
        internal
        view
        returns(uint64)
    {
        return entityLists[getNextKey(_entityName, _key)];
    }

    /**
    * @dev Get key for prev link of entity list
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return byte32 hash
    */
    function getPrevKey(bytes32 _entityName, uint64 _key)
        internal
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(_entityName, "prev", _key));
    }

    /**
    * @dev Get id of prev entity
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return byte32 hash
    */
    function getPrevId(bytes32 _entityName, uint64 _key)
        internal
        view
        returns(uint64)
    {
        return entityLists[getPrevKey(_entityName, _key)];
    }

}
