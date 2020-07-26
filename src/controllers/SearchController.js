const UserModel = require("../models/User");
const FundModel = require("../models/Fund");
const CampaignModel = require("../models/Campaign");
const FaqModel = require("../models/Faq");
const SearchService = require("../services/SearchService");
const response = require("./../utils/response");

class SearchController {
    async users(req, res) {
        if(req.query.q == '' || req.query.q == null) {
            res.status(400).json(response('Please enter a search keyword', '', false));
        }else {
            let result = await SearchService.fuzzySearch(UserModel, req.query.q);
            res.status(200).json(response('User search results', result, true));
        }
    }
    
    async faqs(req, res) {
        if(req.query.q == '' || req.query.q == null) {
            res.status(400).json(response('Please enter a search keyword', '', false));
        }else {
            let result = await SearchService.fuzzySearch(FaqModel, req.query.q);
            res.status(200).json(response('FAQ search results', result, true));
        }
    }
    
    async funds(req, res) {
        if(req.query.q == '' || req.query.q == null) {
            res.status(400).json(response('Please enter a search keyword', '', false));
        }else {
            let result = await SearchService.fuzzySearch(FundModel, req.query.q);
            res.status(200).json(response('Fund search results', result, true));
        }
    }

    async campaigns(req, res) {
        if(req.query.q == '' || req.query.q == null) {
            res.status(400).json(response('Please enter a search keyword', '', false));
        }else {
            let result = await SearchService.fuzzySearch(CampaignModel, req.query.q);
            res.status(200).json(response('Campaigns search results', result, true));
        }
    }
}

module.exports = new SearchController();
