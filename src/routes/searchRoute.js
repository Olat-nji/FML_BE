const router = require("express").Router();
const { users, funds, campaigns, faqs } = require("../controllers/SearchController");

router.get('/users', users);
router.get('/transactions', funds);
router.get('/campaigns', campaigns);
router.get('/faqs', faqs);

module.exports = router;
