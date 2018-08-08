pragma solidity ^0.4.20;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../../contracts/EntityLib.sol";
import "./ThrowHandler.sol";

contract TestEntityList is ThrowHandler {

    using EntityLib for EntityLib.EntityStorage;
    EntityLib.EntityStorage internal entities;

    function addExistingId() private {
        entities.add("Test", 1);
    }

    function addZeroId() private {
        entities.add("Test", 0);
    }

    function deleteZeroId() private {
        entities.remove("Test", 0);
    }

    function deleteUnexistingId() private {
        entities.remove("Test", 100);
    }

    function testAddEntity() public {

        Assert.isFalse(execute('addZeroId()'), "0 id can't be added");

        Assert.equal(uint(entities.getNextId("Test", 0)), uint(0), "after #0 add 0 next id should be 0");
        Assert.equal(uint(entities.getPrevId("Test", 0)), uint(0), "after #0 add 0 prev id should be 0");

        entities.add("Test", 1);

        Assert.equal(uint(entities.getId("Test", 1)), uint(1), "after #1 id should be 1");

        Assert.equal(uint(entities.getNextId("Test", 0)), uint(1), "after #1 add 0 next id should be 1");
        Assert.equal(uint(entities.getPrevId("Test", 0)), uint(1), "after #1 add 0 prev id should be 1");

        Assert.equal(uint(entities.getNextId("Test", 1)), uint(0), "after #1 add 1 next id should be 0");
        Assert.equal(uint(entities.getPrevId("Test", 1)), uint(0), "after #1 add 1 prev id should be 0");

        Assert.isFalse(execute('addExistingId()'), "existing id shouldn't be added");

        entities.add("Test", 2);
        Assert.equal(uint(entities.getNextId("Test", 0)), uint(1), "after #2 add 0 next id should be 1");
        Assert.equal(uint(entities.getPrevId("Test", 0)), uint(2), "after #2 add 0 prev id should be 2");

        Assert.equal(uint(entities.getNextId("Test", 1)), uint(2), "after #2 add 1 next id should be 2");
        Assert.equal(uint(entities.getPrevId("Test", 1)), uint(0), "after #2 add 1 prev id should be 0");

        Assert.equal(uint(entities.getNextId("Test", 2)), uint(0), "after #2 add 2 next id should be 0");
        Assert.equal(uint(entities.getPrevId("Test", 2)), uint(1), "after #2 add 2 prev id should be 1");
        entities.add("Test", 3);
        entities.add("Test", 4);
        entities.add("Test", 5);
        entities.add("Test", 6);
        entities.add("Test", 7);
        entities.add("Test", 8);
    }

    function testGetNextId() public {
        Assert.equal(uint(entities.getNextId("Test", 2)), uint(3), "next for 2 is 1");
        Assert.equal(uint(entities.getNextId("Test", 8)), uint(0), "next for 8 is 0");
    }

    function testGetPrevId() public {
        Assert.equal(uint(entities.getPrevId("Test", 2)), uint(1), "prev for 2 is 1");
        Assert.equal(uint(entities.getPrevId("Test", 1)), uint(0), "prev for 1 is 0");
    }

    function testDeleteEntity() public {
        Assert.isFalse(execute('deleteUnexistingId'), "unexisting id shouldn't be deleted");
        Assert.isFalse(execute('deleteZeroId'), "0 id can't be deleted");

        //delete first element of ring
        entities.remove("Test", 1);
        Assert.equal(uint(entities.getId("Test", 1)), uint(0), "after #1 delete 1 must be deleted");
        Assert.equal(uint(entities.getNextId("Test", 0)), uint(2), "after #1 delete 0 next id should be 2");
        Assert.equal(uint(entities.getPrevId("Test", 0)), uint(8), "after #1 delete 0 prev id should be 8");
        Assert.equal(uint(entities.getNextId("Test", 8)), uint(0), "after #1 delete 8 next id should be 0");
        Assert.equal(uint(entities.getPrevId("Test", 2)), uint(0), "after #1 delete 2 prev id should be 0");

        //delete last element of ring
        entities.remove("Test", 8);
        Assert.equal(uint(entities.getNextId("Test", 0)), uint(2), "after #2 delete 0 next id should be 2");
        Assert.equal(uint(entities.getPrevId("Test", 0)), uint(7), "after #2 delete 0 prev id should be 7");
        Assert.equal(uint(entities.getNextId("Test", 7)), uint(0), "after #2 delete 7 next id should be 0");
        Assert.equal(uint(entities.getPrevId("Test", 2)), uint(0), "after #2 delete 2 prev id should be 0");

        //delete middle element of ring
        entities.remove("Test", 4);
        Assert.equal(uint(entities.getNextId("Test", 3)), uint(5), "after #3 delete 3 next id should be 5");
        Assert.equal(uint(entities.getPrevId("Test", 3)), uint(2), "after #3 delete 3 prev id should be 2");
        Assert.equal(uint(entities.getNextId("Test", 5)), uint(6), "after #3 delete 5 next id should be 6");
        Assert.equal(uint(entities.getPrevId("Test", 5)), uint(3), "after #3 delete 5 prev id should be 3");
    }

    /* function testGetList() public {
        uint64[] memory ids = entities.getList("Test", 1, 20);
        uint64[] memory expected = new uint64[](5);
        expected[0] = 2;
        expected[1] = 3;
        expected[2] = 5;
        expected[3] = 6;
        expected[4] = 7;
        Assert.equal(ids.length, expected.length, "list should be correct");

        ids = entities.getList("Test", 1, 5);
        Assert.equal(ids.length, expected.length, "list should be correct");

        expected = new uint64[](3);
        expected[0] = 3;
        expected[1] = 5;
        expected[2] = 6;
        ids = entities.getList("Test", 3, 3);
        Assert.equal(ids.length, expected.length, "list should be correct");
        Assert.equal(uint(ids[0]), uint(expected[0]), "id 0 must match");
        Assert.equal(uint(ids[1]), uint(expected[1]), "id 1 must match");
        Assert.equal(uint(ids[2]), uint(expected[2]), "id 2 must match");
    } */
}
