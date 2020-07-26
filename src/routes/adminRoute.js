const router = require("express").Router();
const AdminCtrl = require("../controllers/AdminController");
const adminAuth = require("../middlewares/adminAuth");


router.get("/dashboard",  AdminCtrl.dashboard);
module.exports = router;
