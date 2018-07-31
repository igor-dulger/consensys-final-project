var Paginable = artifacts.require("./Paginable.sol");
var exceptions = require("../helpers/expectThrow");
var events = require("../helpers/expectEvent");

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
        await exceptions.expectThrow(
            paginable.setPageSize(web3.toBigNumber(20), {from: alise}),
            exceptions.errTypes.revert
        );
    });

    it("shouldn't set page size more than 100", async () => {
        await exceptions.expectThrow(
            paginable.setPageSize(web3.toBigNumber(200), {from: alise}),
            exceptions.errTypes.revert
        );
    });

    it("shouldn't set page size less than 1", async () => {
        await exceptions.expectThrow(
            paginable.setPageSize(web3.toBigNumber(0), {from: alise}),
            exceptions.errTypes.revert
        );
    });

    it("should emit event", async () => {
        const size = web3.toBigNumber(15);
        await events.inTransaction(
            paginable.setPageSize(size, {from: owner}),
            'PageSizeChanged',
            {
                to: web3.toBigNumber(15),
                from: web3.toBigNumber(10)
            }
        );
    });
});
