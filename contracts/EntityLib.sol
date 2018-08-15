pragma solidity 0.4.24;

/**
 * @title EntityList
 * @author Igor Dulger
 * @dev Handle a set of lists of any entities as a double linked lists turned into a circle
 */
library EntityLib {

    struct EntityStorage {
        mapping (bytes32 => uint64) lists;
    }

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
    modifier newKey(EntityStorage storage self, bytes32 _entityName, uint64 _key) {
        require(getId(self, _entityName, _key) == 0);
        _;
    }

    /**
    * @dev Check if key exists in the list
    * @param _key Entity key.
    */
    modifier existingKey(EntityStorage storage self, bytes32 _entityName, uint64 _key) {
        require(getId(self, _entityName, _key) == _key);
        _;
    }

    /**
    * @dev Add entity to a list
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return bool
    */
    function add(EntityStorage storage self, bytes32 _entityName, uint64 _key)
        internal
        validKey(_key)
        newKey(self, _entityName, _key)
        returns (bool)
    {
        self.lists[getIdKey(_entityName, _key)] = _key;

        self.lists[getPrevKey(_entityName, _key)] = getPrevId(self, _entityName, 0);
        self.lists[getNextKey(_entityName, getPrevId(self, _entityName, 0))] = _key;
        self.lists[getPrevKey(_entityName, 0)] = _key;

        return true;
    }

    /**
    * @dev Delete entity from list.
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return bool
    */
    function remove(EntityStorage storage self, bytes32 _entityName, uint64 _key)
        internal
        validKey(_key)
        existingKey(self, _entityName, _key)
        returns (bool)
    {
        uint64 prev = getPrevId(self, _entityName, _key);
        uint64 next = getNextId(self, _entityName, _key);

        self.lists[getNextKey(_entityName, prev)] = next;
        self.lists[getPrevKey(_entityName, next)] = prev;

        delete self.lists[getIdKey(_entityName, _key)];
        delete self.lists[getPrevKey(_entityName, _key)];
        delete self.lists[getNextKey(_entityName, _key)];

        return true;
    }

    /**
    * @dev Get id from mapping
    * @param _entityName Name of entity.
    * @param _key entity key
    * @return byte32 hash
    */
    function getId(EntityStorage storage self, bytes32 _entityName, uint64 _key)
        internal
        view
        returns(uint64)
    {
        return self.lists[getIdKey(_entityName, _key)];
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
    function getNextId(EntityStorage storage self, bytes32 _entityName, uint64 _key)
        internal
        view
        returns(uint64)
    {
        return self.lists[getNextKey(_entityName, _key)];
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
    function getPrevId(EntityStorage storage self, bytes32 _entityName, uint64 _key)
        internal
        view
        returns(uint64)
    {
        return self.lists[getPrevKey(_entityName, _key)];
    }

}
