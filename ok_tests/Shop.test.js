var Shop = artifacts.require("./Shop.sol");

contract('Shop', function(accounts) {
    var shop;

    const owner = accounts[0]
    const alice = accounts[1];

    it("should add a product to a shop", async () => {
        shop = await Shop.new("MyTestShop", "This shop is created for testing");
        const price = web3.toBigNumber(1000000000);
        const quantity = web3.toBigNumber(15);
        const name = "Test product";
        const image = "some hash";
        const tx = await shop.addProduct(name, price, quantity, image, {from: owner});

        const LogProductAdded = await shop.allEvents();
        const log = await new Promise(function(resolve, reject) {
            LogProductAdded.watch(function(error, log){ resolve(log);});
        });

        assert.equal('ProductAdded', log.event, 'incorrect event emited');
        assert.equal(owner, log.args.actor, 'incorrect owner in the event');
        assert.equal(1, log.args.id, 'incorrect id in the event');
        assert.equal(name, log.args.name, 'incorrect name in the event');
        assert.equal(price.toString(), log.args.price, 'incorrect price in the event');
        assert.equal(quantity.toString(), log.args.quantity, 'incorrect quantity in the event');

        const [id, n, p, q, i] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(price.toString(), p, 'incorrect price was got from contract');
        assert.equal(quantity.toString(), q, 'incorrect quantity was got from contract');
        assert.equal(image.toString(), i, 'incorrect image was got from contract');
    });


    it("should return a product or throw if it doesn't exist", async () => {
        const [id, n, p, q] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(id, 1, 'incorrect id was got from contract');

        try {
            await shop.getProduct(web3.toBigNumber(10), {from: owner});
            assert.equal(0, 1, 'unexisting product was returnd throw expected');
        } catch (e) {
            assert.equal(
                e.message,
                'VM Exception while processing transaction: revert',
                'unexisting product was returnd throw expected'
            );
        }

    });

    it("should edit product", async () => {
        const id = web3.toBigNumber(1);
        const price = web3.toBigNumber(10000000001);
        const quantity = web3.toBigNumber(16);
        const name = "Test product edited";
        const image = "some hash changed";
        const tx = await shop.editProduct(id, name, price, quantity, image, {from: owner});

        const LogProductEdited = await shop.allEvents();
        const log = await new Promise(function(resolve, reject) {
            LogProductEdited.watch(function(error, log){ resolve(log);});
        });

        assert.equal('ProductEdited', log.event, 'incorrect event emited');
        assert.equal(owner, log.args.actor, 'incorrect owner in the event');
        assert.equal(1, log.args.id, 'incorrect id in the event');
        assert.equal(name, log.args.name, 'incorrect name in the event');
        assert.equal(price.toString(), log.args.price, 'incorrect price in the event');
        assert.equal(quantity.toString(), log.args.quantity, 'incorrect quantity in the event');

        const [i, n, p, q, im] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(id.toString(), i, 'incorrect id was got from contract');
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(price.toString(), p, 'incorrect price was got from contract');
        assert.equal(quantity.toString(), q, 'incorrect quantity was got from contract');
        assert.equal(image, im, 'incorrect image was got from contract');
    });

    it("should delete product", async () => {
        const id = web3.toBigNumber(1);

        const [i, n, p, q] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(id.toString(), i, 'incorrect id was got from contract');

        const tx = await shop.deleteProduct(id, {from: owner});

        const LogProductDeleted = await shop.allEvents();
        const log = await new Promise(function(resolve, reject) {
            LogProductDeleted.watch(function(error, log){ resolve(log);});
        });

        assert.equal('ProductDeleted', log.event, 'incorrect event emited');
        assert.equal(owner, log.args.actor, 'incorrect owner in the event');
        assert.equal(1, log.args.id, 'incorrect id in the event');

        try {
            await shop.getProduct(web3.toBigNumber(1), {from: owner});
            assert.equal(0, 1, 'product must be deleted but it exists');
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert', 'product must be deleted but it exists');
        }
    });

    it("should show correct product count", async () => {
        shop = await Shop.new("MyTestShop", "This shop is created for testing");

        const price = web3.toBigNumber(1000000000);
        const quantity = web3.toBigNumber(15);
        const name = "Test product";
        const image = "Test image";
        await shop.addProduct(name, price, quantity, image, {from: owner});

        let count = await shop.getProductCount();
        assert.equal(count, 1, 'Get product count  #1 is invalid');

        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});

        count = await shop.getProductCount();
        let list = await shop.getList(web3.toBigNumber(1),web3.toBigNumber(15));

        assert.equal(count, 3, 'Get product count  #2 is invalid');

        await shop.deleteProduct(web3.toBigNumber(1), {from: owner});

        count = await shop.getProductCount();
        assert.equal(count, 2, 'Get product count  #3 is invalid');

        await shop.deleteProduct(web3.toBigNumber(2), {from: owner});
        await shop.deleteProduct(web3.toBigNumber(3), {from: owner});

        count = await shop.getProductCount();
        assert.equal(count, 0, 'Get product count  #4 is invalid');
    });

    it("should show last product id", async () => {
        let maxId = await shop.getLastProductId();
        assert.equal(maxId, 3, 'last product id #1 is invalid');

        const price = web3.toBigNumber(1000000000);
        const quantity = web3.toBigNumber(15);
        const name = "Test product";
        const image = "Test image";
        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});

        maxId = await shop.getLastProductId();
        assert.equal(maxId, 6, 'last product id #1 is invalid');
    });

    it("should show product list", async () => {
        let list = await shop.getList(web3.toBigNumber(1), web3.toBigNumber(10));
        assert.equal(list.join(), "4,5,6", 'getlist #1 is invalid');

        list = await shop.getList(web3.toBigNumber(10), web3.toBigNumber(100));
        assert.equal(list.join(), "4,5,6", 'getlist #2 is invalid');

        let lastId = await shop.getLastProductId();

        list = await shop.getList(web3.toBigNumber(1), web3.toBigNumber(lastId + 1));
        assert.equal(list.join(), "4,5,6", 'getlist #3 is invalid');

        const price = web3.toBigNumber(1000000000);
        const quantity = web3.toBigNumber(15);
        const name = "Test product";
        const image = "Test image";

        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});
        await shop.addProduct(name, price, quantity, image, {from: owner});

        await shop.deleteProduct(9, {from: owner});
        await shop.deleteProduct(12, {from: owner});

        list = await shop.getList(web3.toBigNumber(1), web3.toBigNumber(100));
        assert.equal(list.join(), "4,5,6,7,8,10,11", 'getlist #3 is invalid');

    });

    it("should return next product", async () => {
        //"4,5,6,7,8,10,11"
        let id = await shop.getNext(4);
        assert.equal(id.toString(), 5, 'get next after 4');

        id = await shop.getNext(1);
        assert.equal(id.toString(), 0, 'get next after 1');

        id = await shop.getNext(11);
        assert.equal(id.toString(), 0, 'get next after 11');

    });

    it("should return prev product", async () => {
        //"4,5,6,7,8,10,11"
        let id = await shop.getPrev(4);
        assert.equal(id.toString(), 0, 'get prev 4');

        id = await shop.getPrev(1);
        assert.equal(id.toString(), 0, 'get prev 1');

        id = await shop.getPrev(11);
        assert.equal(id.toString(), 10, 'get prev 10');
    });

    it("should return first product", async () => {
        //"4,5,6,7,8,10,11"
        let id = await shop.getFirst();
        assert.equal(id.toString(), 4, 'get first');
    });

    it("should return last product", async () => {
        //"4,5,6,7,8,10,11"
        let id = await shop.getLast();
        assert.equal(id.toString(), 11, 'get last');
    });


    it("should buy a product and return extra money to a buyer", async () => {
        shop = await Shop.new("MyTestShop", "This shop is created for testing");

        const price = web3.toBigNumber(web3.toWei(1, 'ether'));
        const quantity = web3.toBigNumber(15);
        const name = "Test product";
        const image = "Test image";
        const id = web3.toBigNumber(1);
        const count = web3.toBigNumber(3);
        const value = web3.toBigNumber(web3.toWei(10,'ether'));

        await shop.addProduct(name, price, quantity, image, {from: owner});

        let was = web3.fromWei(web3.eth.getBalance(alice)).toString();

        const tx = await shop.buyProduct(1, count, {from: alice, value: value});

        // console.log(tx.logs[0]);
        [i, n, p, q] = await shop.getProduct(id);
        assert.equal(id.toString(), i, 'incorrect id was got from contract');
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(price.toString(), p, 'incorrect price was got from contract');
        assert.equal(quantity - count, q, 'quantity is invalid');

        let now = web3.fromWei(web3.eth.getBalance(alice)).toString();
        assert.equal(Math.floor(was - count - now), 0, "Alice's balance is invalid");

        assert.equal(tx.logs.length, 2, 'incorrect number of events emited');

        let log = tx.logs[0];
        assert.equal(log.event, 'ProductQuantityDecreased', 'incorrect event emited');

        log = tx.logs[1];
        assert.equal(log.event, 'ProductSold', 'incorrect event emited');
        assert.equal(log.args.actor, alice, 'incorrect owner in the event');
        assert.equal(log.args.id.toString(), id.toString(), 'incorrect id in the event');
        assert.equal(log.args.quantity.toString(), count.toString(), 'incorrect count in the event');
        assert.equal(log.args.total.toString(), (price * count).toString(), 'incorrect total in the event');
    });
});
