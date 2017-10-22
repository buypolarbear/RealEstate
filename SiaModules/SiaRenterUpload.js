//SiaRenterUpload
var http = require('http');
var path = require('path');

//function to accept file location and name to save in the Sia network
function SiaRenUpl(DestFile, UploadFile, callback) {

  //define connection and save variable for the Sia network
  var options = {
    url: 'localhost',
    method: 'POST',
    port: 9980,
    path: '/renter/upload/' + DestFile + '?source=' + UploadFile,
    headers: {
      'User-Agent': 'Sia-Agent',
    }
  };

  //initialize http request to Sia
  var req = http.request(options, function(res) {
    //return status code outcome
    console.log('Status: ' + res.statusCode);
    callback(res.statusCode);
    console.log('Headers: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(body) {
      console.log('Body: ' + body);
      return callback(res.statusCode);
    });
  });
  //log any error
  req.on('error', function(e) {
    console.log('Error: ' + e);
    return callback(res.statusCode);
  });

  req.end();

};
//Export the function for use in the rest of the app
exports.SiaRenUpl = SiaRenUpl;
