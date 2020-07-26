const router = require("express").Router();
const ContactCtrl = require("../controllers/ContactController");
const auth= require("./../middlewares/adminAuth");

router.post('/form', ContactCtrl.contactForm);
router.get('/',auth(),ContactCtrl.getALL);

module.exports = router;