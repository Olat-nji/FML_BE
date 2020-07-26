// https://github.com/abdul-lahidris

// var userBVN = '123456789'; <===== EXAMPLE BVN =====
// This service returns true if user is verified

require('dotenv').config();
var request = require('request');
var isVerified = false;

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  var secretKey = 'FLWSECK_TEST-SANDBOXDEMOKEY-X';// development
} else {
  var secretKey = process.env.FLUTTERWAVE_V3_SECRET_KEY;// production
}

const makeBvnRequest = (userBVN, callback) => {
  var options = {
    'method': 'GET',
    'url': `https://api.flutterwave.com/v3/kyc/bvns/${userBVN}`,
    'headers': {
      'Authorization': `Bearer ${secretKey}`
    }
  }
  request(options, (error, response) => {
    if (error) { return callback(error); }

    if (userBVN == response.body.data.bvn || response.statusCode == 200) {
        isVerified == true;
    }
    return callback(isVerified);
  });
}
  module.exports = makeBvnRequest;