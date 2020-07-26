const mongoose = require('mongoose');
const user = require('./User');


const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  post: {
    type: String
  },
  imgSrc: {
    type: String
  },
  imgAlt: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Logged in user linked to the blogposst
  author: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    name: {
      type: String
    },
    email: {
      type: String
    }
  },
  // All comments made under the same post
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]

  
});

module.exports = mongoose.model("Blog", BlogSchema);