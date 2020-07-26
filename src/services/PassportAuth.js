const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./../models/User');
const { PORT, FB_CLIENT_ID, FB_CLIENT_SECRET, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID } = process.env;


const facebook = passport.use(new FacebookStrategy({
     clientID: FB_CLIENT_ID,
     clientSecret: FB_CLIENT_SECRET,
     callbackURL: `http://localhost:${PORT}/api/auth/facebook/callback`
},
     async (accessToken, refreshToken, profile, done) => {
          // console.log(profile);
          const user = await User.findOne({ userId: profile.id });
          if (user) {
               done(null, user);
          } else {
               const newUser = new User({
                    userId: profile.id,
                    email: profile.email
               })
               await newUser.save();
          }
     }
));

passport.serializeUser((user, done) => {
     done(null, user.id);
})

passport.deserializeUser((id, done) => {
     const user = User.findById(id);
     done(null, user);
})

const google = passport.use(new GoogleStrategy({
     clientID: GOOGLE_CLIENT_ID,
     clientSecret: GOOGLE_CLIENT_SECRET,
     callbackURL: `http://localhost:${PORT}/auth/google/callback`
},
     function (accessToken, refreshToken, profile, done) {
          User.findOrCreate({ userid: profile.id }, { name: profile.displayName, userid: profile.id },
                function (err, user) {
               return done(err, user);
          });
     }
));

module.exports = {
     facebook,
     google
};



// FB_CLIENT_ID=159030901322260
// FB_CLIENT_SECRET=0d641e47f5d55af221ec80346f3f2d43

// GOOGLE_CLIENT_ID=591307876438-4nmmm817vks785u467lo22kss40kqno2.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET=BagENe4LxG_PZ_qz2oFX7Aok