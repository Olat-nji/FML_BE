const CampaignService = require('../services/CampaignService')
const response = require('../utils/response')
const CustomError = require('../utils/CustomError')

class CampaignController {
  async fetchAllUnfundedCam(req, res) {
    const data = await CampaignService.getAllUnfundedCampaigns()
    res.status(200).send(response('All campaigns fetched', data.reverse()))
  }

  async getCam(req, res) {
    const data = await CampaignService.getSingleCampaign(req.params.id)
    res.status(200).send(response('Campaign data fetched', data))
  }

  async createRequest(req, res) {
    const data = await CampaignService.createRequest(req.user, req.body)
    res.status(201).send(response('Request Created Succesfully', data))
  }

  async fetchSixFeaturedCams(req, res) {
    const data = await CampaignService.featuredSixCampaigns()
    res.status(200).send(response('Featured six campaigns fetched', data.slice(0, 6)))
  }

  async oldUnFundedThreeCams(req, res) {
    const data = await CampaignService.OldNotFundedThreeCampaigns()
    res.status(200).send(response('Old UnFunded Three Campaigns Fetched', data))
  }

  async fetchUserReq(req, res) {
    // Returns a list of all Campaigns a User has created
    const data = await CampaignService.getMany(req.user)
    res.status(200).send(response("User's Requests Fetched", data))
  }

  async fetchUserCam(req, res) {
    // Returns a list of Campaigns a User has invested in
    const data = await CampaignService.getMany(req.user, 'campaign')
    res.status(200).send(response("User's Campaigns Fetched", data))
  }

  authenticate(req, res, next) {
    const isEmpty = Object.keys(req.body).length === 0 && !req.body.constructor === Object
    if (isEmpty) throw new CustomError('Provide relevant Data')
    next()
  }
  async fetchUserOverview(req, res) {
    const data = await CampaignService.userOverview(req.user)
    res.status(200).send(response('User overview fetched', data))
  }

  async fundeeOverview(req, res){
    const data = await CampaignService.fundeeOverview(req.user);
    res.status(200).send(response('Fundee overview fetched', data))
  }
}

module.exports = new CampaignController()
