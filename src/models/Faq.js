const mongoose = require('mongoose')
const mongooseFuzzySearching = require('mongoose-fuzzy-searching')
const Schema = mongoose.Schema

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required']
    },
    answer: {
      type: String,
      // required: [true, 'Answer is required']
    }
  },
    {
      timestamps: true
    }
)

faqSchema.plugin(mongooseFuzzySearching, {
  fields: ['question', 'answer']
})

module.exports = mongoose.model('faqs', faqSchema)
