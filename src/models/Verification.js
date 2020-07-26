const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const verificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
    },
    photoURL: {
      type: String,
      trim: true,
      required: [true, "Photo is required"],
    },
    videoURL: {
      type: String,
      trim: true,
      // required: [true, "Video is required"],
    },
    bvn: {
      type: String,
      trim: true,
      required: [true, "BVN is required"],
    },
    isVerified: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('verifications', verificationSchema)
