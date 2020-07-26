const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const tokenSchema = new Schema(
     {
          user: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: 'Users'
          },
          token: {
               type: String,
               required: true
          },
          createdAt: {
               type: Date,
               required: true,
               default: Date.now,
               expires: 43200
          }
     }
);

tokenSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('tokens', tokenSchema);
