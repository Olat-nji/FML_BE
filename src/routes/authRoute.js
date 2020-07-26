const router = require("express").Router();
const passport = require('passport');
const UserCtrl = require("../controllers/UserController");
const cors = require('cors')

//  Facebook 
router.get('/facebook', passport.authenticate('facebook', { scope: ['profile'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
     function (req, res) {
          // Successful authentication, redirect home.
          res.redirect('/');
     });

/**
    * This route handles the GET verb for user signup with google
*/
router.post('/googleAuth', cors(),UserCtrl.google);


module.exports = router
