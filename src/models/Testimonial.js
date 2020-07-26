const mongoose = require("mongoose");
var random = require('mongoose-simple-random');
const Schema = mongoose.Schema;

const TestimonialSchema = new Schema(
    {
        name: {
            type: String,
            required: true

        },
        text: {
            type: String,
            required: [true, "Text is required"],
        },
        photoUrl: {
            type: String
        },
        companyName: {
            type: String,
            required: [true, "Text is required"],

        }
    },
    {
        timestamps: true,
    }
);
TestimonialSchema.plugin(random)
module.exports = mongoose.model("testimonial", TestimonialSchema);