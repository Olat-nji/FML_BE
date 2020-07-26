const router = require("express").Router();
const TestimonialCtrl = require("../controllers/TestimonialController");
router.post('/create', TestimonialCtrl.createTestimonial);
router.get('/fetch', TestimonialCtrl.fetchRandomTestimonial);

module.exports = router;