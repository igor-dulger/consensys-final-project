var Shop = artifacts.require("./Shop.sol");
var exceptions = require("../helpers/expectThrow");
var events = require("../helpers/expectEvent");

contract('Shop', function(accounts) {
    var shop;

    const owner = accounts[0];
    const alice = accounts[1];

    addShop = async function() {
        const price = web3.toBigNumber(1000000000);
        const quantity = web3.toBigNumber(15);
        const name = "Test product";
        const image = "some hash";
        await shop.addProduct(name, price, quantity, image, {from: owner});
    }

    createTestSet = async function() {
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await shop.deleteProduct(web3.toBigNumber(1), {from: owner});
        await shop.deleteProduct(web3.toBigNumber(2), {from: owner});
        await shop.deleteProduct(web3.toBigNumber(3), {from: owner});
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();

        await shop.deleteProduct(9, {from: owner});
        await shop.deleteProduct(12, {from: owner});
    }

    beforeEach(function() {
        return Shop.new(
            "MyTestShop",
            "This shop is created for testing"
        ).then(function(instance) {
            shop = instance;
        });
    });

    it("should add a product to a shop", async () => {
        const price = web3.toBigNumber(1000000000);
        const quantity = web3.toBigNumber(15);
        const name = "Test product";
        const image = "some hash";

        await events.inTransaction(
            shop.addProduct(name, price, quantity, image, {from: owner}),
            'ProductAdded',
            {
                actor: owner,
                id: web3.toBigNumber(1),
                name: name,
                price: price,
                quantity: quantity
            }
        );

        const [id, n, p, q, i] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(price.toString(), p, 'incorrect price was got from contract');
        assert.equal(quantity.toString(), q, 'incorrect quantity was got from contract');
        assert.equal(image.toString(), i, 'incorrect image was got from contract');
    });


    it("should return a product or throw if it doesn't exist", async () => {
        await this.addShop();
        const [id, n, p, q] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(id, 1, 'incorrect id was got from contract');

        await exceptions.expectThrow(
            shop.getProduct(web3.toBigNumber(10), {from: owner}),
            exceptions.errTypes.revert,
            "Product with id 10 doesn't exist"
        );
    });

    it("should edit product", async () => {
        await this.addShop();
        const id = web3.toBigNumber(1);
        const price = web3.toBigNumber(10000000001);
        const quantity = web3.toBigNumber(16);
        const name = "Test product edited";
        const image = "some hash changed";

        await events.inTransaction(
            shop.editProduct(id, name, price, quantity, image, {from: owner}),
            'ProductEdited',
            {
                actor: owner,
                id: web3.toBigNumber(1),
                name: name,
                price: price,
                quantity: quantity
            }
        );

        const [i, n, p, q, im] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(id.toString(), i, 'incorrect id was got from contract');
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(price.toString(), p, 'incorrect price was got from contract');
        assert.equal(quantity.toString(), q, 'incorrect quantity was got from contract');
        assert.equal(image, im, 'incorrect image was got from contract');
    });

    it("should delete product", async () => {
        await this.addShop();
        const id = web3.toBigNumber(1);

        const [i, n, p, q] = await shop.getProduct(web3.toBigNumber(1), {from: owner});
        assert.equal(id.toString(), i, 'incorrect id was got from contract');

        await events.inTransaction(
            shop.deleteProduct(id, {from: owner}),
            'ProductDeleted',
            {
                actor: owner,
                id: web3.toBigNumber(1)
            }
        );

        await exceptions.expectThrow(
            shop.getProduct(web3.toBigNumber(1), {from: owner}),
            exceptions.errTypes.revert,
            "Product with id 1 doesn't exist"
        );
    });

    it("should show correct product count", async () => {
        await this.addShop();

        let count = await shop.getProductCount();
        assert.equal(count, 1, 'Get product count  #1 is invalid');

        await this.addShop();
        await this.addShop();

        count = await shop.getProductCount();
        let list = await shop.getProducts(web3.toBigNumber(1),web3.toBigNumber(15));

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
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await shop.deleteProduct(web3.toBigNumber(1), {from: owner});
        await shop.deleteProduct(web3.toBigNumber(2), {from: owner});
        await shop.deleteProduct(web3.toBigNumber(3), {from: owner});

        let maxId = await shop.getLastProductId();
        assert.equal(maxId, 3, 'last product id #1 is invalid');

        await this.addShop();
        await this.addShop();
        await this.addShop();

        maxId = await shop.getLastProductId();
        assert.equal(maxId, 6, 'last product id #1 is invalid');
    });

    it("should show product list", async () => {
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await shop.deleteProduct(web3.toBigNumber(1), {from: owner});
        await shop.deleteProduct(web3.toBigNumber(2), {from: owner});
        await shop.deleteProduct(web3.toBigNumber(3), {from: owner});
        await this.addShop();
        await this.addShop();
        await this.addShop();

        let list = await shop.getProducts(web3.toBigNumber(1), web3.toBigNumber(10));
        assert.equal(list.join(), "4,5,6", 'getProducts #1 is invalid');

        list = await shop.getProducts(web3.toBigNumber(10), web3.toBigNumber(100));
        assert.equal(list.join(), "4,5,6", 'getProducts #2 is invalid');

        let lastId = await shop.getLastProductId();

        list = await shop.getProducts(web3.toBigNumber(1), web3.toBigNumber(lastId + 1));
        assert.equal(list.join(), "4,5,6", 'getProducts #3 is invalid');

        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();
        await this.addShop();

        await shop.deleteProduct(9, {from: owner});
        await shop.deleteProduct(12, {from: owner});

        list = await shop.getProducts(web3.toBigNumber(1), web3.toBigNumber(100));
        assert.equal(list.join(), "4,5,6,7,8,10,11", 'getProducts #3 is invalid');
    });

    // it("should return next product", async () => {
    //     await createTestSet();
    //     //"4,5,6,7,8,10,11"
    //     let id = await shop.getNext(4);
    //     assert.equal(id.toString(), 5, 'get next after 4');
    //
    //     id = await shop.getNext(1);
    //     assert.equal(id.toString(), 0, 'get next after 1');
    //
    //     id = await shop.getNext(11);
    //     assert.equal(id.toString(), 0, 'get next after 11');
    //
    // });
    //
    // it("should return prev product", async () => {
    //     await createTestSet();
    //     //"4,5,6,7,8,10,11"
    //     let id = await shop.getPrev(4);
    //     assert.equal(id.toString(), 0, 'get prev 4');
    //
    //     id = await shop.getPrev(1);
    //     assert.equal(id.toString(), 0, 'get prev 1');
    //
    //     id = await shop.getPrev(11);
    //     assert.equal(id.toString(), 10, 'get prev 10');
    // });
    //
    // it("should return first product", async () => {
    //     await createTestSet();
    //     //"4,5,6,7,8,10,11"
    //     let id = await shop.getFirst();
    //     assert.equal(id.toString(), 4, 'get first');
    // });
    //
    // it("should return last product", async () => {
    //     await createTestSet();
    //     //"4,5,6,7,8,10,11"
    //     let id = await shop.getLast();
    //     assert.equal(id.toString(), 11, 'get last');
    // });


    it("should buy a product and return extra money to a buyer", async () => {

        const name = "Test product";
        const price = web3.toBigNumber(web3.toWei(0.1, 'ether'));
        const quantity = web3.toBigNumber(15);
        const image = "Test image";

        const id = web3.toBigNumber(1);

        const count = web3.toBigNumber(3);
        const value = web3.toBigNumber(web3.toWei(10,'ether'));

        await shop.addProduct(name, price, quantity, image, {from: owner});

        let was = web3.fromWei(web3.eth.getBalance(alice)).toString();

        await events.inTransaction(
            shop.buyProduct(1, count, {from: alice, value: value}),
            'ProductSold',
            {
                actor: alice,
                id: id,
                quantity: count,
                total: web3.toBigNumber(price * count)
            }
        );

        [i, n, p, q] = await shop.getProduct(id);
        assert.equal(id.toString(), i, 'incorrect id was got from contract');
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(price.toString(), p, 'incorrect price was got from contract');
        assert.equal(quantity - count, q, 'quantity is invalid');

        let now = web3.fromWei(web3.eth.getBalance(alice)).toString();
        assert(was - price * count - now < web3.toWei(1, 'ether'), "Alice's balance is invalid");

        await events.inTransaction(
            shop.buyProduct(1, count, {from: alice, value: value}),
            'ProductQuantityDecreased',
            {
                actor: alice,
                id: id,
                quantity: count,
            }
        );
    });
});
