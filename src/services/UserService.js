const User = require("./../models/User");
const EmailSubscription = require("./../models/EmailSubcription.js");
const Token = require("./../models/Token");
const CustomError = require("./../utils/CustomError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const _ = require('lodash');
const Axios = require('./../utils/axios');
const { Roles } = require("../config/constants");
const emailConfirmationString = require("./../../views/email-confirmation");

class UserService {
  async getActive(data) {
    const user = data;
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      photoURL: user.photoURL,
      isVerified: user.isVerified,
      isAdmin: user.role === "user" ? false : true,
      isAuth: true,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      address: user.address
    };
  }

  async subscribeUser(email) {
    const emailRegex = /[\w|.]+[@]+\w+[.]+[\w|.]*$/gm;

    if (!email.trim().length) throw new CustomError("Email is required");
    const isEmail = emailRegex.test(email);

    if (isEmail) {
      const userExist = await EmailSubscription.findOne({
        email
      });
      if (userExist) throw new CustomError("Email already exists");

      const subscribe = new EmailSubscription({
        email
      });

      await subscribe.save();

      return {
        email
      };
    } else {
      throw new CustomError("Invalid Email format");
    }
  }

  async sendVerificationMail(userId, userEmail) {
    let email = userEmail

    if (!userEmail) {
      const user = await User.findOne({ _id: userId });

      if (!user) throw new CustomError("User not found. Please sign up");
      if (user.isVerified) throw new CustomError("Email already verified. Please login");

      email = user.email
    }

    await Token.findOneAndDelete({ user: userId })

    const verifyToken = new Token({
      user: userId,
      token: await jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: `1d` }),
    });

    await verifyToken.save();

    // const url = `${process.env.BASE_URL}/api/users/verification/?uid=${userId}&token=${verifyToken.token}`;
    const url = `${process.env.BASE_URL_LIVE}/api/users/verification/?uid=${userId}&token=${verifyToken.token}`;
    const data = {
      recipient: email,
      sender: 'femiadenuga@mazzacash.com',
      site_name: 'http://fundmylaptop.com',

      subject: "Please confirm your email",
      htmlBody: emailConfirmationString(url),
      cc: "",
      bcc: "",

      body: "string 0000",
      site_name: "FML",
      confirmation_link: url,
      backend_type: "string"
    }


    //send mail
    await Axios.postCall('https://email.microapi.dev/v1/sendmailwithtemplate/', data);
    // await Axios.postCall('https://email.microapi.dev/v1/send_confirmation/', data);

    return null;
  }

  async register(req, formData) {
    const userExist = await User.findOne({ email: formData.email });
    if (userExist) throw new CustomError("Email already exists");

    if (!formData.password) throw new CustomError("password field should not be empty");
    if (!formData.phone) throw new CustomError("phone field should not be empty");
    if (!formData.address) throw new CustomError("address field should not be empty");

    let user = new User(formData);

    var verifyToken = new Token({
      user: user._id,
      token: await jwt.sign({
        user: user._id
      }, process.env.JWT_SECRET, {
        expiresIn: `1d`
      }),
    });
    const base_url = `${req.protocol}://${req.get('host')}`;
    await Token.create(verifyToken);
    const url = `${base_url}/api/users/verification/?uid=${user._id}&token=${verifyToken.token}`;
    const data = {
      recipient: user.email,
      site_name: `${base_url}`,
      confirmation_link: url,
      sender: 'femiadenuga@mazzacash.com',
    }
    // console.log(data)
    //send mail
    await Axios.postCall('https://email.microapi.dev/v1/send_confirmation/', data);

    await this.sendVerificationMail(user._id, user.email)

    await user.save();

    user = _.pick(user, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role',
      'photoURL',
    ]);

    return user;
  }

  async login(data) {
    if (!data.email) throw new CustomError("Email is required");
    if (!data.password) throw new CustomError("Password is required");

    const user = await User.findOne({
      email: data.email
    });
    if (!user) throw new CustomError("Incorrect email or password");
    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) throw new CustomError("Incorrect email or password");

    if (user.isVerified === false) {
      return {
        message: "Please verify your email and then login, or resend verification email",
        resend_url_local: `http://localhost:2200/api/users/resend-verification-mail/${user._id}`,
        resend_url_live: `${process.env.BASE_URL_LIVE}/api/users/resend-verification-mail/${user._id}`

      }
    } else {

      const token = await jwt.sign({
        id: user._id,
        role: user.role
      },
        process.env.JWT_SECRET, {
        expiresIn: `1d`
      }
      );

      return (data = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        photoURL: user.photoURL,
        address: user.address,
        phone: user.phone,
        token
      });
    }
  }

  async getMany() {
    let users = await User.find({});
    let allUsers = [];
    users.forEach((user) => {
      user = _.pick(user, [
        '_id',
        'firstName',
        'lastName',
        'email',
        'role',
        'photoURL'
      ]);

      allUsers.push(user);
    })

    return allUsers;
  }

  async getById(userId) {
    let user = await User.findOne({
      _id: userId
    });

    user = _.pick(user, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role',
      'photoURL'
    ]);
    return user;
  }

  async update(userId, data) {
    const usr = await User.findById(userId);

    if (usr.photoURL != null) {
      if (data.photoURL != null) {
        fs.unlink(usr.photoURL, (err) => {
          if (err) console.log("Error deleting user profile image.");
        });
      }
    }

    let user = await User.findByIdAndUpdate({
      _id: userId
    }, data, {
      new: true,
    });

    if (!user) throw new CustomError("User dosen't exist", 404);

    user = _.pick(user, [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role',
      'photoURL'
    ]);

    return user;
  }

  async deleteOne(userId) {
    const user = await User.findOne({
      _id: userId
    });
    user.remove();
    return user;
  }

  async verification(query) {
    const result = await Token.findOne({ token: query.token });

    if (!result) throw new CustomError("Invalid token provided")

    const decoded = await jwt.verify(query.token, process.env.JWT_SECRET);


    await Token.findOneAndDelete({ user: decoded.userId })

    //Verify and save the user
    let isVerified = true;
    let user = await User.findByIdAndUpdate(
      { _id: decoded.userId },
      { isVerified },
      { new: true }
    );

    // user = _.pick(user, [
    //   '_id',
    //   'firstName',
    //   'lastName',
    //   'email',
    //   'role',
    //   'photoURL'
    // ]);

    return true;
  }

  async deleteUserAcct(req) {
    let user_id = req.params.user_id
    if (req.user.role !== Roles.ADMIN) {
      if (req.user.id !== user_id) {
        throw new CustomError("please dont termper with another persons account");
      }
      else {
        // console.log('acct deleted')
        const deleteUser = await User.findByIdAndRemove(user_id)
        if (!deleteUser) throw new CustomError("user does not exist ")
        return null
      }
    } else {
      const deleteUser = await User.findByIdAndRemove(user_id)
      if (!deleteUser) throw new CustomError("user does not exist ")
      return null

    }
  }

  // forgot password 

  async forgotPassword(req, res) {
    const userExist = await User.findOne({
      email: req.body.email
    });
    if (!userExist) throw new CustomError("user does not exists");


    // generate jwt token with user payload

    var verifyToken = new Token({
      user: userExist._id,
      token: await jwt.sign({
        user: userExist._id
      }, process.env.JWT_SECRET, {
        expiresIn: `1d`
      }),
    });
    const base_url = `${req.protocol}://${req.get('host')}`;
    await Token.create(verifyToken);

    // pass token and userId to url => http://localhost:3000/reset-password?token=${token}&userId=${userId}

    const url = `${base_url}/api/users/resetpassword/?uid=${userExist._id}&token=${verifyToken.token}`;

    const data = {
      recipient: userExist.email,
      site_name: `${base_url}`,
      confirmation_link: url,
      sender: 'femiadenuga@mazzacash.com',
    }
    //send mail to user containing the password reset link

    await Axios.postCall('https://email.microapi.dev/v1/send_confirmation/', data);
    res.status(201).send(response("reset password email has been sent to you successfully", data));


  }

  // reset password
  async resetPassword(req, res) {
    if (!req.body.email) {

      return res.status(500).json({ message: 'Email is required' });

    }

    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(409).json({ message: 'Email does not exist' });
    }

    var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });

    resettoken.save(function (err) {

      if (err) { return res.status(500).send({ msg: err.message }); }

      passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
      res.status(200).json({ message: 'Reset Password successfully.' });
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
          user: 'user',
          pass: 'password'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'femiadenuga@mazzacash.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:2200/response-reset-password/' + resettoken.resettoken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }

      transporter.sendMail(mailOptions, (err, info) => {
      })
    })
  }

  //Validate Password Token

  async validPasswordToken(req, res) {
    if (!req.body.resettoken) {
      return res.status(500).json({ message: 'Token is required' });
    }
    const user = await passwordResetToken.findOne({
      resettoken: req.body.resettoken
    });
    if (!user) {
      return res.status(409).json({ message: 'Invalid URL' });
    }

    User.findOneAndUpdate({ _id: user._userId }).then(() => {
      res.status(200).json({ message: 'Token verified successfully.' });
    }).catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
  }
  //Setting a new password

  async newPassword(req, res) {
    passwordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
      if (!userToken) {
        return res.status(409).json({ message: 'Token has expired' });
      }
      User.findOne({ _id: userToken._userId }, function (err, userEmail, next) {
        if (!userEmail) {
          return res.status(409).json({ message: 'User does not exist' });
        }
        return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            return res.status(400).json({ message: 'Error hashing password' });
          }
          userEmail.password = hash;
          userEmail.save(function (err) {
            if (err) {
              return res.status(400).json({ message: 'Password can not reset.' });
            } else {
              userToken.remove();
              return res.status(201).json({ message: 'Password reset successfully' });
            }
          });
        });
      });
    })
  }


  //payload =  decode the token
  // check if the userId == payload.userId
  // hash the new password
  //update the user password


}



module.exports = new UserService();