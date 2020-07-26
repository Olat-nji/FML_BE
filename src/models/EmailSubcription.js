const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSubscriptionSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
    },
  },
  {
    timestamps: true,
  }
);

let emailSubscription;

try {
  emailSubscription = mongoose.model("emailSubscription");
} catch (error) {
  emailSubscription = mongoose.model(
    "emailSubscription",
    emailSubscriptionSchema
  );
}

module.exports = emailSubscription;
