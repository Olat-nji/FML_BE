const mongoose = require("mongoose");
const { schema } = require("./User");

const Schema = mongoose.Schema;

let CommentSchema = new Schema({

  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    name: {
      type: String
    }

  }

});

module.exports = mongoose.model("Comment", CommentSchema);