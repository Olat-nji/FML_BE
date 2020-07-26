const Request = require('./../models/Campaign')
const Recommendation = require("./../models/Recommendation");
const User = require('../models/User')
const Fund = require('../models/Fund')
const CustomError = require('../utils/CustomError')
const Axios = require('./../utils/axios')
const _ = require('lodash')
const { recommendationengine } = require('googleapis/build/src/apis/recommendationengine')

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

class CampaignService {
  async createRequest(user, body) {
    if (body.amount < 0) throw new CustomError('Amount cannot be less than zero')

    const loanRequest = {}

    loanRequest.user = user
    loanRequest.title = body.title
    loanRequest.description = body.description
    loanRequest.location = body.location
    loanRequest.amount = body.amount
    loanRequest.photoURL = body.photoURL
    loanRequest.repaymentPeriod = body.repaymentPeriod
    loanRequest.repaymentTimes = body.repaymentTimes
    if (body.occupation) loanRequest.occupation = body.occupation
    if (body.currency) loanRequest.occupation = body.occupation

    const newRequest = await new Request(loanRequest)
    const notifyuserdata = {
      recipient: user.email,
      sender: 'femiadenuga@mazzacash.com',
      subject: 'FUNDMYLAPTOP: Campaign Update',
      body: `Hello ${user.email},

             Your campaign has been successfully created and its now live
            
             FUNDMYLAPTOP Team.`
    }
  
    await Axios.postCall('https://email.microapi.dev/v1/sendmail/', notifyuserdata) //send mail
    let data = await newRequest.save()

    data = _.pick(data, [
      'user',
      'title',
      'description',
      'amount',
      'photoURL',
      'repaymentPeriod',
      'repaymentTimes'
    ])

    return data
  }

  async getMany(user, type = 'request') {
    var result;
    if (type === 'request') {
      result = await this.UserRequest(user)
    } else if (type === 'campaign') {
      result = await this.UserCampaign(user)
    } else {
      throw new CustomError("invalid type ['request' or 'campaign']")
    }
    return result;
  }

  async UserRequest(user) {
    // Find all Requests that User created
    console.log('request');
    const allReq = await Request.find({ user: user }, (err, res) => {
      if (err) throw new CustomError(err);
      return res;
    })
    
    // Return Data in reverse order (newest first)
    return allReq.reverse()
  }
  
  async UserCampaign(user) {
    // Find all Requests that User has Invested in (Campaign)
    // 1. First get all funds by that user
    const allFunds = await Fund.find({ user: user }, (err, res) => {
      if (err) throw new CustomError(err);
      return res;
    })
    
    // 2. For each fund, get the Campaign/Request data
    // const allReq = []
    // asyncForEach(allTrans, async (val) => {
    //   const req = await Request.findOne({ id: val.Campaign })
    //   allReq.push(req)
    // })
    
    // Return all results in reverse order (newest first)
    return allFunds.reverse();
  }

  async getAllUnfundedCampaigns() {
    const isNotFunded = await Request.find({isFunded: false}, (err, res) => {
      if (err) throw new CustomError(err)
        return res
    }).populate('user', {password: 0, googleTokens: 0, isActive: 0, __v: 0})
    return isNotFunded
  }

  async getSingleCampaign(data) {
    const campData = await Request.findOne(data.id, {isFunded: 0, isActive: 0, isSuspended: 0, __v: 0}).populate('user', {isVerified: 0, password: 0, googleTokens:0, isActive:0, google: 0, __v: 0})
    const recommenders = await Recommendation.find({recUser: campData.user._id}).populate('user', {isVerified: 0, password: 0, googleTokens:0, isActive:0, google: 0, __v: 0, role: 0})
    if(!campData) throw new CustomError('Campaign not found')
    return {campData, recommenders: [...recommenders]}
  }

  async featuredSixCampaigns() {
    const featuredSixCamps = await Request.find({ isFeatured: true }).limit(6)
    return featuredSixCamps
  }

  async OldNotFundedThreeCampaigns() {
    const oldNotFundedThreeCampaigns = await Request.find({ isFunded: false }).limit(3)
    return oldNotFundedThreeCampaigns
  }

  async userOverview(id) {
    // Checking if user exists
    const user = await User.findOne({ _id:id})
    if (!user) throw new CustomError('User do not exist', 401)

    // An array of all the user fundings
    const allFunds = await Fund.find({ user: user._id }).populate('Campaign')
    const arrayOfAmounts = allFunds.map((trans) => trans.amount)

    // This is the total money invested
    let totalMoneyInvested = 0
    if(arrayOfAmounts.length > 0){
      totalMoneyInvested = arrayOfAmounts.reduce((accum, currVal) => accum + currVal)
    }

    const inactiveFundings = []
    allFunds.forEach((trans) => {
      if (!trans.campaign.isActive && trans.campaign.isFunded) {
        inactiveFundings.push(trans.amount)
      }
    })
    // inactiveFunding now contains array of finished funds(Amount)

    const amountRecieved = 0
    if (inactiveFundings.length > 0) {
      amountRecieved = inactiveFundings.reduce((accum, currentValue) => accum + currentValue)
    }
    const remainingAmount = totalMoneyInvested - amountRecieved
    const numOfInvestments = allFunds.length
    const averageInves = totalMoneyInvested / numOfInvestments
    const percentageInterest = (10 / 100) * averageInves // Where 10 is assumed to be the interest rate

    return {
      investedAmount: totalMoneyInvested,
      repaidAmount: amountRecieved,
      remainingAmount: remainingAmount,
      averageInvestment: averageInves ? averageInves : 0,
      averageInterest: percentageInterest ? percentageInterest: 0,
      numOfInvestments
    }
  }
}

module.exports = new CampaignService()
