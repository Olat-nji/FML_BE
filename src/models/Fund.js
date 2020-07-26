const mongoose = require("mongoose");
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");
const Schema = mongoose.Schema;


const fundSchema = new Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaigns",
      required: [true, "Campaign is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    success: {
      type: Boolean,
    }
  },
  {
    timestamps: true
  }
);

fundSchema.plugin(mongooseFuzzySearching, { fields: ['amount'] });

module.exports = mongoose.model('funds', fundSchema)
