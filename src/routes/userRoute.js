const router = require("express").Router();
const UserCtrl = require("../controllers/UserController");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multerMiddleware")("picture");

router.get("/active", auth(), UserCtrl.getActive);

router.post("/register", UserCtrl.register);
router.post("/login", UserCtrl.login);

router.get("/verification", UserCtrl.verification);
router.get(
  "/resend-verification-mail/:userId",
  UserCtrl.resendVerificationMail
);

router.get("/allUsers", auth(), UserCtrl.getMany);
router.get("/:userId", auth(), UserCtrl.getById);

router.put("/:userId", auth(), multer[0], multer[1], UserCtrl.update);
router.delete("/:userId", auth(), UserCtrl.delete);

router.post("/subscribe", UserCtrl.addUserToMailSubcription);

// /delete user acct
router.post("/deleteUserAcct/:user_id",  auth(), UserCtrl.deleteUserAcct);

//forgot password
// router.post("/forgotPassword", UserCtrl.forgotPassword);
// router.post('/req-reset-password', UserCtrl.resetPassword);
// router.post('/new-password', UserCtrl.newPassword);
// router.post('/valid-password-token', UserCtrl.validPasswordToken);

module.exports = router;
