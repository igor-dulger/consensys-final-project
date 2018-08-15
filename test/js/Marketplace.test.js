var Marketplace = artifacts.require("./Marketplace.sol");
var Shop = artifacts.require("./Shop.sol");
var exceptions = require("../helpers/expectThrow");
var events = require("../helpers/expectEvent");

contract('Marketplace', function(accounts) {
    var contract;

    [
        owner,
        admin,
        seller,
        seller2,
        buyer
    ] = accounts;

    beforeEach(function() {
       return Marketplace.new().then(function(instance) {
          contract = instance;
       });
    });

    it("should give an admin role, allowable only for an owner", async () => {
        assert.isFalse(await contract.isAdmin(admin), "shouldn't have admin role yet");
        let tx = await contract.addAdmin(admin, {from: owner});
        assert.isTrue(await contract.isAdmin(admin), "shouldn have admin role");

        //Marketplace seller can't add admin role
        await exceptions.expectThrow(
            contract.addAdmin(admin, {from: seller}),
            exceptions.errTypes.revert,
            "Marketplace seller can't add admin role"
        );

        //Marketplace admin can't add admin role
        await exceptions.expectThrow(
            contract.addAdmin(seller, {from: admin}),
            exceptions.errTypes.revert,
            "Marketplace admin can't add admin role"
        );
    });

    it("should remove an admin role from an address, allowable only for an owner", async () => {
        await contract.addAdmin(admin, {from: owner});
        assert.isTrue(await contract.isAdmin(admin), "shouldn have admin role");
        await contract.removeAdmin(admin, {from: owner});
        assert.isFalse(await contract.isAdmin(admin), "shouldn't have admin role");

        await contract.addAdmin(admin, {from: owner});

        //Marketplace admin can't remove admin role
        await exceptions.expectThrow(
            contract.removeAdmin(admin, {from: admin}),
            exceptions.errTypes.revert,
            "Marketplace admin can't remove admin role"
        );

        //Marketplace seller can't remove admin role
        await exceptions.expectThrow(
            contract.removeAdmin(admin, {from: seller}),
            exceptions.errTypes.revert,
            "Marketplace seller can't remove admin role"
        );
    });

    it("should give a seller role, allowable for admin and owner", async () => {
        await contract.addAdmin(admin, {from: owner});

        assert.isFalse(await contract.isSeller(seller), "seller doesn't have seller role yet");
        await contract.addSeller(seller, {from: owner});
        assert.isTrue(await contract.isSeller(seller), "seller should have seller role");

        await contract.addSeller(seller, {from: admin});

        //Marketplace seller can't grant seller role
        await exceptions.expectThrow(
            contract.addSeller(buyer, {from: seller}),
            exceptions.errTypes.revert,
            "Marketplace seller can't grant seller role"
        );
    });

    it("should remove an seller role from an address, allowable for admin and owner", async () => {
        await contract.addAdmin(admin, {from: owner});

        await contract.addSeller(seller, {from: admin});
        assert.isTrue(await contract.isSeller(seller), "shouldn have seller role");
        await contract.removeSeller(seller, {from: owner});
        assert.isFalse(await contract.isSeller(seller), "shouldn't have seller role");

        await contract.addSeller(seller, {from: owner});
        assert.isTrue(await contract.isSeller(seller), "shouldn have seller role #2");
        await contract.removeSeller(seller, {from: admin});
        assert.isFalse(await contract.isSeller(seller), "shouldn't have seller role #2");

        await contract.addSeller(seller, {from: owner});

        //Marketplace seller can't remove seller role
        await exceptions.expectThrow(
            contract.removeSeller(seller, {from: seller}),
            exceptions.errTypes.revert,
            "Marketplace seller can't remove seller role"
        );
    });

    it("should a new shop should be created", async () => {
        const name = "Shop name";
        const description = "Shop description";

        await contract.addAdmin(admin, {from: owner});
        await contract.addSeller(seller, {from: owner});

        //Marketplace owner can't create shop
        await exceptions.expectThrow(
            contract.createShop(name, description, {from: owner}),
            exceptions.errTypes.revert,
            "Marketplace owner can't create shop"
        );

        //Marketplace admin can't create shop
        await exceptions.expectThrow(
            contract.createShop(name, description, {from: admin}),
            exceptions.errTypes.revert,
            "Marketplace admin can't create shop"
        );

        //buyer can't create shop
        await exceptions.expectThrow(
            contract.createShop(name, description, {from: buyer}),
            exceptions.errTypes.revert,
            "buyer can't create a shop"
        );

        await events.inTransaction(
            contract.createShop(name, description, {from: seller}),
            'ShopAdded',
            {
                id: web3.toBigNumber(1),
                name: name,
                owner: seller
            }
        );

        let [i, n, d, a, o] = await contract.getShop(web3.toBigNumber(1));

        assert.equal(1, i, 'incorrect id was got from contract');
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(description, d, 'incorrect descripton was got from contract');
        assert.equal(seller, o, 'incorrect owner was got from contract');

        //check shop contract
        const shop = await Shop.at(a);
        shopName = await shop.name();
        shopDescription = await shop.description();

        assert.equal(name, shopName, 'incorrect name in shop contract');
        assert.equal(description, shopDescription, 'incorrect descripton in shop contract');
    });

    it("should a shop should be deleted", async () => {

        await contract.addAdmin(admin, {from: owner});
        await contract.addSeller(seller, {from: owner});
        await contract.addSeller(seller2, {from: owner});

        const name = "Shop name";
        const description = "Shop description";
        await contract.createShop(name, description, {from: seller});

        //Marketplace owner can't delete shop
        await exceptions.expectThrow(
            contract.deleteShop(web3.toBigNumber(1), {from: owner}),
            exceptions.errTypes.revert,
            "Marketplace owner can't delete shop"
        );

        //Marketplace admin can't delete shop
        await exceptions.expectThrow(
            contract.deleteShop(web3.toBigNumber(1), {from: admin}),
            exceptions.errTypes.revert,
            "Marketplace admin can't delete shop"
        );

        //buyer can't delete a shop
        await exceptions.expectThrow(
            contract.deleteShop(web3.toBigNumber(1), {from: buyer}),
            exceptions.errTypes.revert,
            "buyer can't delete a shop"
        );

        //Shop doesn't exist
        await exceptions.expectThrow(
            contract.deleteShop(web3.toBigNumber(4), {from: seller}),
            exceptions.errTypes.revert,
            "Shop doesn't exist"
        );

        //Seller2 isn't owner of shop 1
        await exceptions.expectThrow(
            contract.deleteShop(web3.toBigNumber(1), {from: seller2}),
            exceptions.errTypes.revert,
            "Seller2 isn't owner of shop 1"
        );

        await events.inTransaction(
            contract.deleteShop(web3.toBigNumber(1), {from: seller}),
            'ShopDeleted',
            {
                actor: seller,
                id: web3.toBigNumber(1),
            }
        );
        // Shop deleted and doen't exist
        await exceptions.expectThrow(
            contract.getShop(web3.toBigNumber(1)),
            exceptions.errTypes.revert,
            "Shop deleted and doen't exist"
        );
    });

    it("should return shop with id 2", async () => {
        await contract.addSeller(seller, {from: owner});

        let name = "Shop name";
        let description = "Shop description";
        await contract.createShop(name, description, {from: seller});

        name = "Shop name 2";
        description = "Shop description 2";
        await contract.createShop(name, description, {from: seller});

        let [i, n, d, a, o] = await contract.getShop(web3.toBigNumber(2));

        assert.equal(2, i, 'incorrect id was got from contract');
        assert.equal(name, n, 'incorrect name was got from contract');
        assert.equal(description.toString(), d, 'incorrect descripton was got from contract');
        assert.equal(seller, o, 'incorrect owner was got from contract');
    });

    it("should return next shop ids", async () => {

        const name = "Shop name";
        const description = "Shop description";

        await contract.addSeller(seller, {from: owner});
        await contract.addSeller(seller2, {from: owner});

        contract.createShop(name, description, {from: seller});
        contract.createShop(name, description, {from: seller});
        contract.createShop(name, description, {from: seller});
        contract.createShop(name, description, {from: seller2});
        contract.createShop(name, description, {from: seller2});
        contract.createShop(name, description, {from: seller2});


        let [i, n, d, a, o] = await contract.getNext(web3.toBigNumber(0));
        assert.equal(i.toString(), 1, 'incorrect next 1 shop got from contract');

        [i, n, d, a, o] = await contract.getNext(web3.toBigNumber(3));
        assert.equal(i.toString(), 4, 'incorrect next 3 shop got from contract');

        await exceptions.expectThrow(
            contract.getNext(web3.toBigNumber(6)),
            exceptions.errTypes.revert,
            "End of shop list expected"
        );

        await exceptions.expectThrow(
            contract.getNext(web3.toBigNumber(100)),
            exceptions.errTypes.revert,
            "Next of unexisting element"
        );

    });

    it("should return next shop id for sellers", async () => {

        const name = "Shop name";
        const description = "Shop description";

        await contract.addSeller(seller, {from: owner});
        await contract.addSeller(seller2, {from: owner});

        contract.createShop(name, description, {from: seller});
        contract.createShop(name, description, {from: seller});
        contract.createShop(name, description, {from: seller});
        contract.createShop(name, description, {from: seller2});
        contract.createShop(name, description, {from: seller2});
        contract.createShop(name, description, {from: seller2});


        let [i, n, d, a, o] = await contract.getSellersNext(seller, web3.toBigNumber(0));
        assert.equal(i.toString(), 1, 'incorrect next 1 shop got for seller');

        [i, n, d, a, o] = await contract.getSellersNext(seller, web3.toBigNumber(2));
        assert.equal(i.toString(), 3, 'incorrect next 3 shop got for seller');

        await exceptions.expectThrow(
            contract.getSellersNext(seller, web3.toBigNumber(3)),
            exceptions.errTypes.revert,
            "End of shop list expected for seller"
        );

        await exceptions.expectThrow(
            contract.getSellersNext(seller, web3.toBigNumber(100)),
            exceptions.errTypes.revert,
            "Next of unexisting element for seller"
        );

        [i, n, d, a, o] = await contract.getSellersNext(seller2, web3.toBigNumber(0));
        assert.equal(i.toString(), 4, 'incorrect next 1 shop got for seller2');

        [i, n, d, a, o] = await contract.getSellersNext(seller2, web3.toBigNumber(4));
        assert.equal(i.toString(), 5, 'incorrect next 3 shop got for seller2');

        await exceptions.expectThrow(
            contract.getSellersNext(seller2, web3.toBigNumber(6)),
            exceptions.errTypes.revert,
            "End of shop list expected for seller2"
        );

        await exceptions.expectThrow(
            contract.getSellersNext(seller2, web3.toBigNumber(100)),
            exceptions.errTypes.revert,
            "Next of unexisting element for seller2"
        );
    });


    // it("should should return next shop ids", async () => {
    //     list = await contract.getSellerShops(seller, web3.toBigNumber(1), web3.toBigNumber(10));
    //     assert.equal(list.join(), [1,2,3], 'incorrect list for seller');
    //
    //     list = await contract.getSellerShops(seller2, web3.toBigNumber(1), web3.toBigNumber(10));
    //     assert.equal(list.join(), [4,5,6], 'incorrect list for seller2');
    //
    //     contract.deleteShop(web3.toBigNumber(1), {from: seller});
    //     contract.deleteShop(web3.toBigNumber(5), {from: seller2});
    //
    //     list = await contract.getSellerShops(seller, web3.toBigNumber(1), web3.toBigNumber(10));
    //     assert.equal([2,3], list.join(), 'incorrect list for seller');
    //
    //     list = await contract.getSellerShops(seller2, web3.toBigNumber(1), web3.toBigNumber(10));
    //     assert.equal([4,6], list.join(), 'incorrect list for seller2');
    //
    //     contract.createShop(name, description, {from: seller});
    //     contract.createShop(name, description, {from: seller});
    //     contract.createShop(name, description, {from: seller});
    //     contract.createShop(name, description, {from: seller2});
    //     contract.createShop(name, description, {from: seller2});
    //     contract.createShop(name, description, {from: seller2});
    //     contract.createShop(name, description, {from: seller});
    //     contract.createShop(name, description, {from: seller});
    //
    //     //page size is 10, so only 10 ids is expected
    //     list = await contract.getShops(web3.toBigNumber(1),web3.toBigNumber(20));
    //     assert.equal(list.join(), [2,3,4,6,7,8,9,10,11,12], 'incorrect list got from contract');
    // });
});
