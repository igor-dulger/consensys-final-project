var Paginable = artifacts.require("./Paginable.sol");

contract('Paginable', function(accounts) {
    var paginable;

    beforeEach(function() {
       return Paginable.new().then(function(instance) {
          paginable = instance;
       });
    });

    const owner = accounts[0]
    const alise = accounts[1]

    it("should get page size", async () => {
        const actual = await paginable.getPageSize();
        assert.equal(actual, 10, 'incorrect page size after constructor');
    });

    it("should set page size", async () => {
        const size = web3.toBigNumber(22);

        await paginable.setPageSize(size, {from: owner});
        let newSize = await paginable.getPageSize();

        assert.equal(newSize.toString(), size, 'incorrect page size test 1');
    });

    it("shouldn't set page from Alise", async () => {
        try {
            await paginable.setPageSize(web3.toBigNumber(20), {from: alise});
            assert.true(false, 'invalid page size');
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert', 'invalid exception');
        }
    });

    it("shouldn't set page size more than 100", async () => {
        try {
            await paginable.setPageSize(web3.toBigNumber(200), {from: owner});
            assert.true(false, 'invalid page size');
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert', 'invalid exception');
        }
    });

    it("shouldn't set page size less than 1", async () => {
        try {
            await paginable.setPageSize(web3.toBigNumber(0), {from: owner});
            assert.true(false, 'invalid page size');
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert', 'invalid exception');
        }
    });

    it("should emit event", async () => {
        const size = web3.toBigNumber(15);

        let tx = await paginable.setPageSize(size, {from: owner});

        assert.equal(tx.logs[0].event, 'PageSizeChanged', 'incorrect event emited');
        assert.equal(tx.logs[0].args.to.toString(), 15, 'incorrect to in the event');
        assert.equal(tx.logs[0].args.from.toString(), 10, 'incorrect from in the event');
    });
});
