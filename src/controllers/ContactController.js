const contactService = require('../services/Contact');
const response = require("../utils/response");
// POST route from contact form
class ContactContoller {
  async contactForm(req, res) {
    const data = await contactService.createContact(req.body);
    res.status(201).send(response("Form submitted successfully"));
  }

  async getALL(req, res) {
    const data = await contactService.getAll(req.user.id);
    res.status(200).send(response("Data retrieved successfully",data));
  }
}
module.exports = new ContactContoller();
