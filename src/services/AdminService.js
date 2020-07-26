const User = require('../models/User')
const Fund = require('../models/Fund')
const Campaign = require('../models/Campaign')
const CustomError = require('../utils/CustomError')

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

class AdminService {


  async dashboard() {
  
// 
// Get number of all funders from the Fund table
//    


    
    // 1. First get all Funds
    const allTrans = await Fund.distinct('user', (err, res) => {
      if (err) throw new CustomError(err)
      return res
    })

    
    // Count the number of  elements 
    const NoOfFunders=  allTrans.length;
    




    
//  
// Get number of all fundees from Campaign
// 


    // 1. First get all campaigns
    const allCampaigns = await Campaign.distinct('user', (err, res) => {
        if (err) throw new CustomError(err)
        return res
      })
  
     
      // Count the number of elements 
     const NoOfFundees=  allCampaigns.length;
      



// 
//   Calculate percentage of loan granted
// 


      // 1. First get all Funds

      const Funds = await Fund.find({ success: true })
      const arrayOfAmountsInv = Funds.map((trans) => trans.amount)
  
      // This is the total money invested
      const totalMoneyInvested = arrayOfAmountsInv.reduce((accum, currVal) => accum + currVal)

      const Campaigns = await Campaign.find({ })
      const arrayOfAmountsReq = Campaigns.map((camps) => camps.amount)
  
      // This is the total money invested
      const totalMoneyRequested = arrayOfAmountsReq.reduce((accum, currVal) => accum + currVal)
      const percent =(totalMoneyRequested/totalMoneyInvested)*100
      
    
    
    
    // 
    // Return all campaigns
    // 
    const campaign = await Campaign.find({ }, (err, res) => {
      if (err) throw new CustomError(err)
      return res
    })

    // 2. For each   campaign, place the user into an array
    const campaigns = []
    var status="";
    asyncForEach(campaign, async (val) => {
      const req = await User.findById(val.user)
      if(val.isActive=true){
     status="Approved";
      }else{
        status="Pending"
      }
      const toPush={"name":req.firstName+' '+req.lastName,"photoURL":req.photoURL,"amount":val.amount,"status":status};
      campaigns.push(toPush)
    })
  
    // 
    // Return total Profit
    // 

    
        // An array of all the user fundings
        const allFunds = await Fund.find({ success: true })
        const arrayOfAmounts = allFunds.map((trans) => trans.amount)

        // This is the total profit
        const totalProfit = (arrayOfAmounts.reduce((accum, currVal) => accum + currVal))*0.9

   
        


   
    return {
         totalProfit : totalProfit,
         campaigns : campaigns,
         percent : percent,
         NoOfFunders : NoOfFunders,
         NoOfFundees : NoOfFundees
    }
  }
}

module.exports = new AdminService()
