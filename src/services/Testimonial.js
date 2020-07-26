const CustomError = require('../utils/CustomError');
const Testimonial = require('../models/Testimonial')


class TestimonialService {
    async createTestimonial(data) {
        const { name, text, photoUrl, companyName } = data;
        // save input fields
        const details = {
            name,
            text,
            photoUrl,
            companyName
        }
        const testimonial = new Testimonial(details);
        let result = await testimonial.save();
        return result

    }

    async fetchTestimonial() {

        const data = await Testimonial.findRandom({}, {}, { count: 1 }, function (err, results) {
            if (err) return (err);
            else {
                return results;
            }

        });

        return data
    }
}

module.exports = new TestimonialService()
