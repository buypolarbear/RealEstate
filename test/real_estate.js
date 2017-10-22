var RealEstate = artifacts.require("./RealEstate.sol");

contract('RealEstate', function(accounts) {

      it("should assert true", function(done) {
        var real_estate;
        return RealEstate.deployed().then(function(instance) {
          var real_estate = instance;
          return real_estate.getpersonCount();
        }).then(function(result) {
          assert.equal(result.toNumber(), 0, "Person Count Number Does Not Match");
        });
      });
