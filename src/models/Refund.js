const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refundSchema = new Schema({
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'Campaigns',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  amountPaid: {
    type: Number,
  },
  balance: {
    type: Number,
  },
  repaymentsLeft: {
    type: Number,
  },
  lastPaymentDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('refunds', refundSchema);
