const faqCtrl = require("../controllers/FaqController");
const router = require("express").Router();
const adminAuth = require("../middlewares/adminAuth");


router.get('/', faqCtrl.getAll);
router.get('/seed', faqCtrl.seed);
router.post('/create', faqCtrl.createFaq);
router.put('/update/:id', adminAuth(), faqCtrl.updateFaq);
router.delete('/delete/:id', adminAuth(), faqCtrl.deleteFaq);

module.exports = router;
