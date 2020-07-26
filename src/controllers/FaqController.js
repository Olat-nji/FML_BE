const FaqService = require("../services/FaqService");
const response = require("../utils/response");

class FaqController {
    async getAll(req, res) {
        let data = await FaqService.getAll();
        return res.status(200).json(response('FAQs', data, true));
    }

    async seed(req, res) {
        let data = [
            {
                question: "What is FundMylaptop?",
                answer: "FundMyLaptop is an online platform that helps fundees get funds to purchase or repair their laptop by intoducing them to funders"
            },
            {
                question: "How do I join FundMyLaptop?",
                answer: "Joining FundMylaptop is very easy, simply go to the registration page and fill in the required details and hit the Signup button."
            },
            {
                question: "What does campaign mean?",
                answer: "Campaign is the same as fund request. It involves requesting for a certain amount of money from the funders on FundMylaptop"
            },
            {
                question: "How do I become a funder?",
                answer: "You can become a funder on FundMylaptop by funding any campaign you are interested in funding"
            }
        ]

        let result = await FaqService.seed(data);
        return res.status(200).json(response('FAQs', result, true));
    }
    async createFaq(req, res) {
        let data = await FaqService.createFaq(req.body,req);
        return res.status(200).json(response('FAQ created', data, true));
    }

    async updateFaq(req, res) {
        let data = await FaqService.updateFaq(req.body,req);
        return res.status(200).json(response('FAQ updated', data, true));
    }
    
    async deleteFaq(req, res) {
        let data = await FaqService.deleteFaq(req.params.id);
        return res.status(200).json(response('FAQ Deleted', data, true));
    }
}

module.exports = new FaqController();
