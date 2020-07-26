const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recommendationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    recUser: {
      type: String,
      required: [true, "Recommended User is required"],
    },
    text: {
      type: String,
      required: [true, "Text is required"],
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("recommendations", recommendationSchema);
