const CustomError = require("./../utils/CustomError");
const {encrypt} = require('./encryptPaymentService');
const Validaion_id = require('../models/validaion_id');
const forge = require("node-forge");
const axios = require("axios");
const Axios = require('../utils/axios');
const secret_key =process.env.FLUTTERWAVE_SECRET_KEY
const key =process.env.FLUTTERWAVE_ENCRYPT_KEY


class PaymentService {

  async card_payment(data,req) { 
    if (!data.card_number) { throw new CustomError("provide all required data", 400);}
    if (!data.cvv) { throw new CustomError("provide all required data", 400);}
    if (!data.expiry_month) { throw new CustomError("provide all required data", 400);}
    if (!data.expiry_year) { throw new CustomError("provide all required data", 400);}
    if (!data.amount) { throw new CustomError("provide all required data", 400);}
    if (!data.fundee) { throw new CustomError("provide all required data", 400);}
    data.type='card'
    data.currency='NGN'
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }
    data.tx_ref=makeid(7)
    data.email= req.user.email
    data.fullname=`${ req.user.lastName} ${req.user.firstName}`
  const encrypted_data = encrypt(key,data);

  //making a request to flutterwave api with encrypted text
  const payment = await axios({
    method: "post",
    url: "https://api.flutterwave.com/v3/charges",
    responseType: "json",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${secret_key}`,
    },
    params: { type: "card" },
    data: { client: encrypted_data },
  });
console.log(payment.data)
  if (payment.data.status === "error") {
    throw new CustomError("An error occured", 400, payment.data.message);
  } else {return { flw_ref: payment.data.data.flw_ref }}
}

// payment validation
    async validate_payment(data,req) {
      let { flw_ref, otp ,fundee} = data;
      if (!otp) { throw new CustomError("please provide the otp", 400);}
      if (!fundee) { throw new CustomError("please provide the fundee", 400);}
    if (!flw_ref) { throw new CustomError("please provide the ref-number", 400);}
  otp = parseInt(otp);
    
  //making a post call to flutterwave api with the user OTP for validation
  const validate_payment = await axios({
    method: "post",
    url: "https://api.flutterwave.com/v3/validate-charge",
    responseType: "json",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${secret_key}`,
    },
    data: {flw_ref,otp,}
  });
  if (validate_payment.data.data.status === "successful") {
    let newValidId = new Validaion_id({validaion_id: validate_payment.data.data.id})
   await newValidId.save()

  
 const notifyuserdata = {
    recipient:fundee,
    sender: 'femiadenuga@mazzacash.com',
    subject: 'FUNDMYLAPTOP: Campaign Update',
    body:  `Hello ${fundee},
  
            ${ req.user.lastName} ${req.user.firstName} just funded your campaign
            
            FUNDMYLAPTOP Team.`
   }
   await Axios.postCall('https://email.microapi.dev/v1/sendmail/', notifyuserdata) //send mail

    return   { validaion_id: validate_payment.data.data.id}
  } else {
    throw new CustomError("An error occured",400,validate_payment.data.message);}
    }

    //payment verification
    async verify_payment(token){
      //checking if data provided is valid
  const  id  = token;
  if(!id) throw new CustomError("id is not define, please provide", 400);
  const verify_payment = await axios({
    method: "get",
    url: `https://api.flutterwave.com/v3/transactions/${id}/verify`,
    responseType: "json",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${secret_key}`,
    },
  });
  
  if (verify_payment.data.data.status === "successful") {
    return  {Transaction_id: verify_payment.data.data.id}
  } else {
    throw new CustomError("Transaction unsuccessful",400,verify_payment.data.message);
  }
    }
}

  
module.exports = new PaymentService();
