const router = require("express").Router();
const RecCtrl = require("./../controllers/RecommendationController");
const auth = require('./../middlewares/auth');

router.post("/create", auth(), RecCtrl.create);
router.get("/users/:userId", auth(), RecCtrl.getUserRec);

module.exports = router
