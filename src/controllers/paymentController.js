const PaymentService = require("./../services/PaymentServices");
const response = require("./../utils/response");

class paymentContoller {

  // verify card detials
  async card_payment(req, res) {
    const data = await PaymentService.card_payment(req.body,req);
    res.status(201).send(response("This Credit card is a Valid Card", data));
  }
 // validate payment
  async validate_payment(req, res) {
    const data = await PaymentService.validate_payment(req.body,req);
    res.status(201).send(response("Validation successful", data));
  }

//verify payment
  async verify_payment(req, res) {
    const data = await PaymentService.verify_payment(req.params.token);
    res.status(201).send(response("Transaction Successful", data));
  }

  
}

module.exports = new paymentContoller();
