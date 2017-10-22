//Require express for routing managements
var express = require("express");
var app = express();

//Require server, io and http to setup server
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var http = require("http");

//Require formidable and multer to manage form and upload submissions
var formidable = require("formidable");
var multer = require("multer");

//Set directory for document uplads
var uploadDir = './DocumentUploads/';

//Call the SiaRenterFiles to submit document uploads to the Sia network
var SiaRenUplFn = require(siaDir + 'SiaRenterUpload');
var SiaRenUpl = SiaRenUplFn.SiaRenUpl;

//Set the SiaRenterFiles module location
var siaDir = './SiaModules/';

//Require path to resolve paths
var path = require('path');

//Configue multer to handle document upload
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
    //callback(null, file.originalname + '-' + Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));
  }
});

//Require and configure bodyParse to handle form details
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

//Require and Initialize web3
Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//Select the 1st account in the Ethereum wallet to use for transactions
var ethAcc = web3.eth.accounts[0];

//FileSystem module
var fs = require('fs');

//Initialize contract variable
var contractInstance;

//Compile solidity code
code = fs.readFileSync('./contracts/RealEstate.sol').toString();
solc = require('solc');
compiledCode = solc.compile(code);

//byteCode and ABI
var byteCode = compiledCode.contracts[':RealEstate'].bytecode;
var abiDefinition = JSON.parse(compiledCode.contracts[':RealEstate'].interface);

//Set variable to the deployed contract
var RealEstateContract = web3.eth.contract(abiDefinition);

//Set variable to the deployed contract variable AND the contract address
//Note the contract address will differ for each contract migration
var contractInstance = RealEstateContract.at('0x6fc77cd198086cbf7c0ed43609310f7bda62566d');

//Set the public directory for assets
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

//Listen for connections
server.listen(3000);
console.log('Listening on 3000')

//Set home page route
app.get('/', function(req, res) {
  res.render('Home');
});

//Set persons route
app.get('/Persons', function(req, res) {

  //List all persons
  contractInstance.listPersons.call({
    from: ethAcc
  }, function(error, result) {
    console.log(JSON.stringify(result));
    if (error) {
      console.log('The error is: ')
      console.log(error)
    } else {
      console.log(JSON.stringify(result));

      //Define arrays to receive person details
      var NationalID = [];
      var FirstName = [];
      var LastName = [];
      var Gender = [];
      var DateOfBirth = [];
      var DownloadImage = [];
      var EthereumAddress = [];

      //Push person details
      for (var i = 0; i < result[0].length; i++) {
        NationalID.push(web3.toAscii(result[0][i]).replace(/\u0000/g, ''));
        FirstName.push(web3.toAscii(result[1][i]).replace(/\u0000/g, ''));
        LastName.push(web3.toAscii(result[2][i]).replace(/\u0000/g, ''));
        Gender.push(web3.toAscii(result[3][i]).replace(/\u0000/g, ''));
        DateOfBirth.push(result[4][i]);
        DownloadImage.push(web3.toAscii(result[5][i]).replace(/\u0000/g, ''));
        EthereumAddress.push(result[6][i]);
      }

      //Store arrays in object
      var response = {
        NationalID: NationalID,
        FirstName: FirstName,
        LastName: LastName,
        Gender: Gender,
        DateOfBirth: DateOfBirth,
        DownloadImage: DownloadImage,
        EthereumAddress: EthereumAddress
      };
      console.log('The JSON Strigify of response is');
      console.log(JSON.stringify(response));
      //Send object to client
      res.render('Persons', {
        Persons: response
      });
    }
  });
});

//Set persons route
app.get('/Property', function(req, res) {

  //List all persons
  contractInstance.listPersons.call({
    from: ethAcc
  }, function(error, result) {
    console.log(JSON.stringify(result));
    if (error) {
      console.log('The error is: ')
      console.log(error)
    } else {
      console.log(JSON.stringify(result));

      //Create array to store national ID
      var NationalID = [];

      //Push NationalID details
      for (var i = 0; i < result[0].length; i++) {
        NationalID.push(web3.toAscii(result[0][i]).replace(/\u0000/g, ''));
      }

      var response = {
        NationalID: NationalID
      };
      console.log('The JSON Strigify of response is');
      console.log(JSON.stringify(response));

      //Get properties list
      contractInstance.listProperty.call({
        from: ethAcc,
        gas: 2000000
      }, function(error, result) {
        console.log(JSON.stringify(result));
        if (error) {
          console.log('The error is: ')
          console.log(error)
        } else {
          console.log(JSON.stringify(result));

          //Create arrays to receive property details
          var PropertyIDArray = [];
          var NationalIDArray = [];
          var PropertyTypeArray = [];
          var AddressArray = [];
          var CityArray = [];
          var ZipCodeArray = [];
          var SaleValueArray = [];

          //Push property details to arrays
          for (var i = 0; i < result[0].length; i++) {
            PropertyIDArray.push(web3.toAscii(result[0][i]).replace(/\u0000/g, ''));
            NationalIDArray.push(web3.toAscii(result[1][i]).replace(/\u0000/g, ''));
            PropertyTypeArray.push(web3.toAscii(result[2][i]).replace(/\u0000/g, ''));
            AddressArray.push(web3.toAscii(result[3][i]).replace(/\u0000/g, ''));
            CityArray.push(web3.toAscii(result[4][i]).replace(/\u0000/g, ''));
            ZipCodeArray.push(result[5][i]);
            SaleValueArray.push(result[6][i]);
          }

          //Store arrays in an object
          var propertyResponse = {
            PropertyIDArray: PropertyIDArray,
            NationalIDArray: NationalIDArray,
            PropertyTypeArray: PropertyTypeArray,
            AddressArray: AddressArray,
            CityArray: CityArray,
            ZipCodeArray: ZipCodeArray,
            SaleValueArray: SaleValueArray
          };

          //Push persons AND property details objects to client
          res.render('Property', {
            Persons: response,
            Properties: propertyResponse
          });
        }
      });
    }
  });
});

app.post('/SubmitNewPerson', urlencodedParser, function(req, res) {

  var upload = multer({
    storage: storage
  }).single('SubmitPhoto');
  upload(req, res, function(err) {
    if (err) {
      res.end('Error');
    } else {
      console.log('The req body is:');
      console.log(req);
      console.log(typeof req.body.SubmitDateOfBirth);
      console.log(parseInt(req.body.SubmitDateOfBirth.replace('-', '')));

      //===Upload File to Sia -- START -- commented out as this is a slow process ATM===//

      //var uploadName = req.file.originalname + '-' + Date.now() + req.file.originalname.slice(req.file.originalname.lastIndexOf('.'));
      //var uploadName = req.file.originalname;

      // SiaRenUpl(uploadName, path.join(__dirname, uploadDir, uploadName), function(err, result) {
      //
      //   console.log(result);
      //
      //   if (err) {
      //     console.log(err)
      //     res.end('File not uploading to Sia');
      //   } else {
      //     console.log('Success: ' + result);

      //===Upload File to Sia -- END -- commented out as this is a slow process ATM===//

      //Send the details of the new person to the invoked contract
      contractInstance.addPerson(
        req.body.SubmitNationalID,
        req.body.SubmitFirstName,
        req.body.SubmitLastName,
        req.body.SubmitGender,
        parseInt(req.body.SubmitDateOfBirth.replace('-', '')),
        'TEMPVAL',
        req.body.SubmitAddress, {
          from: web3.eth.accounts[0],
          gas: 500000
        },
        function(error, result) {
          if (error) {
            console.log(error)
          } else {
            {
              //Send transaction result to client
              res.json(result);
            }
          }
        });
    }
  })
});

//Submit a new property
app.post('/SubmitNewProperty', urlencodedParser, function(req, res) {

  //Configure multer for property photo file upload
  var upload = multer({
    storage: storage
  }).single('SubmitPropertyPhoto');
  upload(req, res, function(err) {
    if (err) {
      res.end('Error');
    } else {
      console.log('The req body is:');
      console.log(req);

      //===Upload File to Sia -- START -- commented out as this is a slow process ATM===//

      //var uploadName = req.file.originalname + '-' + Date.now() + req.file.originalname.slice(req.file.originalname.lastIndexOf('.'));
      //var uploadName = req.file.originalname;

      // SiaRenUpl(uploadName, path.join(__dirname, uploadDir, uploadName), function(err, result) {
      //
      //   console.log(result);
      //
      //   if (err) {
      //     console.log(err)
      //     res.end('File not uploading to Sia');
      //   } else {
      //     console.log('Success: ' + result);
      //===Upload File to Sia -- END -- commented out as this is a slow process ATM===//


      //Send the details of the new property to the invoked contract
      contractInstance.addProperty(
        req.body.PersonNationalID,
        req.body.SubmitPropertyID,
        req.body.SubmitPropertyType,
        req.body.SubmitAddress,
        req.body.SubmitCity,
        req.body.SubmitZipCode,
        req.body.SubmitCountry,
        'TEMPVAL',
        req.body.SubmitSaleValue,

        {
          from: web3.eth.accounts[0],
          gas: 500000
        },
        function(error, result) {
          if (error) {
            console.log(error)
          } else {
            {
              //Send transaction result to client
              res.json(result);
            }
          }
        });
    }
  })
});

//Find person details
app.post('/findPerson', urlencodedParser, function(req, res) {

  //Retreive person ID
  var TransactionId = req.body.TransactionId;
  console.log('NationalID Value: ' + TransactionId);

  //Request person details with the provided ID
  contractInstance.getPerson(TransactionId, {
    from: ethAcc
  }, function(error, result) {
    if (error) {
      console.log(error)
    } else {

      //Format response and store in object
      var response = {
        PersonFirstName: web3.toAscii(result[0]).replace(/\u0000/g, ''),
        PersonLastName: web3.toAscii(result[1]).replace(/\u0000/g, ''),
        PersonGender: web3.toAscii(result[2]).replace(/\u0000/g, ''),
        PersonDateOfBirth: result[3],
        PersonImageLink: web3.toAscii(result[4]).replace(/\u0000/g, ''),
        PersonAddress: result[5]
      };
      //Send object to client
      res.json(response);
    }
  });
});

//Get property details
app.post('/findProperty', urlencodedParser, function(req, res) {

  var PropertyID = req.body.TransactionId;

  contractInstance.getProperty(PropertyID, {
    from: ethAcc
  }, function(error, result) {
    if (error) {
      console.log(error)
    } else {

      var response = {
        PropertyType: web3.toAscii(result[0]).replace(/\u0000/g, ''),
        Address: web3.toAscii(result[1]).replace(/\u0000/g, ''),
        City: web3.toAscii(result[2]).replace(/\u0000/g, ''),
        ZipCode: result[3],
        SaleValue: result[4]
      };
      res.json(response);
    }
  });
});


//Push number of persons registered to client
contractInstance.PersonsCounter().watch(function(error, result) {
  if (!error) {
    console.log('Persons Counter');
    console.log(JSON.stringify(result));
    io.send(['PersonsCounter', result.args.CurrentPersonsCounter]);
  }
})

//Push number of property listings to client
contractInstance.PropertyCounter().watch(function(error, result) {
  if (!error) {
    console.log('Sales Counter');
    console.log(JSON.stringify(result));
    io.send(['PropertyCounter', result.args.ActivePropertyCounter]);
  }
})
