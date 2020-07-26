const testimonialService = require('../services/Testimonial');
const response = require("../utils/response");

class TestimonialController {
    async createTestimonial(req, res) {
        const data = await testimonialService.createTestimonial(req.body);
        res.status(201).send(response("Testimonial submitted successfully", data));
    }

    async fetchRandomTestimonial(req, res) {
        const data = await testimonialService.fetchTestimonial()
        res.status(200).send(response("Testimonial retrieved successfully", data));


    }
}
module.exports = new TestimonialController();
