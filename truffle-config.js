module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    qa: {
      host: "localhost",
      port: 8545,
      network_id: 2 // Match any network id
    },
    production: {
      host: "localhost",
      port: 8545,
      network_id: 1 // Match any network id
    }
  }
};
