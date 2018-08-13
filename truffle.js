/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
            gas: 6712388
        },
        live: {
          // host: "178.25.19.88", // Random IP for example purposes (do not use)
          // port: 80,
          // network_id: 1,        // Ethereum public network
          // optional config values:
          // gasPrice
          // from - default address to use for any transaction Truffle makes during migrations
          // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
          //          - function that returns a web3 provider instance (see below.)
          //          - if specified, host and port are ignored.
      },
      ropsten: {
        provider: function() {
          return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/");
        },
        network_id: '3',
      },
      test: {
        provider: function() {
          return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/");
        },
        network_id: '*',
      },
    }
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
};
