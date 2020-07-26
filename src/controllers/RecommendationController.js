const RecommendationService = require("./../services/RecommendationService");
const response = require("./../utils/response");

class RecommendationContoller {
  async create(req, res) {
    const data = await RecommendationService.create(req.body);
    res.status(201).send(response("Recommendation added", data));
  }
  async getUserRec(req, res) {
    const data = await RecommendationService.getUserRec(req.params.userId);
    res.status(200).send(response(" User Recommendations Retrieved", data));
  }
}
module.exports = new RecommendationContoller();
