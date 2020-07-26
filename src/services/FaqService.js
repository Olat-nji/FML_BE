const FaqModel = require("../models/Faq");
const CustomError = require('../utils/CustomError');
const { Roles } = require("./../config/constants")


class FaqService {
    async getAll() {
        return await FaqModel.find({});
    }
    async createFaq(data,req) {
      let newFaq = new FaqModel(data);
      let saved = await newFaq.save();
      if(!saved){ throw new CustomError("FAQ not created succesfully"); }
      return saved._id;
    }

    async updateFaq(data,req) {
        let update = await FaqModel.findByIdAndUpdate(id, data, { new: true });
        if(!update){ throw new CustomError("FAQ not updated"); }
        return update._id;
    }

    async deleteFaq(id) {
        let del = await FaqModel.deleteOne(id);
        if(!del){ throw new CustomError("FAQ not deleted"); }
        return;
    }
}

module.exports = new FaqService();
