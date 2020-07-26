/**
 * @file Using the separation of concern principle, this file handles the business
 * logic of signing up and signing in a user with a google account
 */
// Depedencies
const {
  OAuth2Client
} = require('google-auth-library');
const _ = require('lodash');
const User = require('./../../models/User');
const jwt = require('jsonwebtoken');
const CustomError = require("./../../utils/CustomError");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

module.exports = async (req) => {
  //get token from request
  const {
    idToken
  } = req.body;

  //verify token
  const verify = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  let {
    email_verified,
    name,
    email,
    picture
  } = verify.payload;
  console.log(verify.payload);
  //chec if email is verified
  if (email_verified) {
    let user = await User.findOne({
      email: email
    });
    if (user) {
      const token = await jwt.sign({
        id: user._id,
        role: user.role
      }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });

      user = _.pick(user, [
        '_id',
        'firstName',
        'lastName',
        'email',
        'photoURL',
        'role'
      ]);

      let data = user;
      data.token = token;
      // returns updated user details 
      return data;
    } else {
      let password = email + process.env.JWT_SECRET;
      name = name.split(' ');
      let firstName = name[0];
      let lastName;
      if (name[1]) {
        lastName = name[1];
      } else {
        lastName = name[0]
      }
      let data = {
        firstName,
        lastName,
        email,
        photoURL: picture,
        password
      };
      // create the new user in the database
      user = new User(data);
      let newUser = await user.save();
      const token = await jwt.sign({
        id: newUser._id,
        role: newUser.role
      }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      // pick only required fields
      newUser = _.pick(newUser, [
        '_id',
        'firstName',
        'lastName',
        'email',
        'photoURL',
        'role'
      ]);
      data = newUser;
      data.token = token;
      // returns new user data
      return data;
    }

  } else {
    throw new CustomError("Google login failed. Emila not verified", 400);
  }
}