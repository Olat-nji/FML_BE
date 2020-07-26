
// const authenticate = require("../middlewares/authenticatorMiddleware");
const router = require("express").Router();
const auth = require('../middlewares/auth')

//route handlers defined in the cotroller
const {
  card_payment,
  validate_payment,
  verify_payment,
} = require("../controllers/paymentController");

//routes for making payment, validating OTP and verifying payment
router.post("/pay", auth(), card_payment);
router.post("/validate",auth(), validate_payment);
router.post("/verify/:token",auth(),verify_payment);

//exports router as a module
module.exports = router;
