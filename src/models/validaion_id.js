const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const validaion_id = new Schema(
     {
          
        validaion_id: {
               type: String,
               required: true
          },
          createdAt: {
               type: Date,
               required: true,
               default: Date.now,
            //    expires: 43200
          }
     }
);

// tokenSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('validaion_id', validaion_id)
