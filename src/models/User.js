const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");
const { Roles } = require("./../config/constants")


const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true
    },
    password: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    photoURL: {
     type: String,
     default: "https://f0.pngfuel.com/png/136/22/profile-icon-illustration-user-profile-computer-icons-girl-customer-avatar-png-clip-art.png"
    },
    google: {
      type: String,
      default: ''
    },
    googleTokens: Object,
    role: {
      type: String,
      trim: true,
      enum: [Roles.USER],
      default: Roles.USER
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(mongooseFuzzySearching, { fields: ['firstName', 'lastName', 'email', 'phone', 'address'] });

userSchema.pre("save", async function (next) {

   /**
    *  A useful condition for the OAuth Services, prevents the empty string password
    *  from being hashed. Password field would be empty since we are using oAuth
    */
   if (!this.password) {
     this.isVerified = true
     return next()
    };
 
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});


let user = mongoose.model('users',userSchema)

module.exports = user
