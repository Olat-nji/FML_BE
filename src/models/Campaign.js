const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')
const Schema = mongoose.Schema

const campaignSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'User is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    description: {
      type: String,
      required: [true, 'Video is required']
    },
    photoURL: {
      type: String
      // required: [true, "Photo is required"],
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    occupation: {
      type: String,
      trim: true,
      enum: ['unavailable', 'student'],
      default: 'unavailable'
    },
    currency: {
      type: String,
      trim: true,
      enum: ['NGN', 'USD'],
      default: 'NGN'
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required']
    },
    amountAccumulated: {
      type: Number,
      default: 0
    },
    repaymentPeriod: {
      type: Date,
      required: [true, 'Repayment period is required']
    },
    repaymentTimes: {
      type: Number,
      required: [true, 'Repayment times is required']
    },
    isFunded: {
      type: Boolean,
      default: false
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

campaignSchema.plugin(mongooseFuzzySearching, {
  fields: ['title', 'description', 'location', 'occupation']
})

module.exports = mongoose.model('campaigns', campaignSchema)
