const Recommendation = require("./../models/Recommendation");
const User = require("./../models/User");
const CustomError = require("./../utils/CustomError");

class RecommendationService {
  async create(data) {
    if(Object.keys(data).length === 0) throw new CustomError("Invalid data sent");
    
   const recommendedBy = await User.findOne({email: data.email}, {isVerified: 0, password: 0, googleTokens:0, isActive:0, google: 0, __v: 0})
    if (!recommendedBy) throw new CustomError("User not found");

        
    const recommendedUser = await User.findOne({_id: data.recommended_user}, {isVerified: 0, password: 0, googleTokens:0, isActive:0, google: 0, __v: 0})
    if (!recommendedUser) throw new CustomError("Recommended User not found");
    
    const recommendation = new Recommendation({ user: recommendedBy._id, recUser: data.recommended_user, text: data.text });
   await recommendation.save();

    return recommendation;
  }

  async getUserRec(userId) {
    const user = await User.findById(userId)
    if (!user) throw new CustomError('User not found')
    const recommendation = await Recommendation.find({recUser: userId})
                                    .select('id user text')
                                    .populate('user', 'id photoURL').limit(12)
    if (recommendation.length < 1) throw new CustomError('User has no recommendation')
    return recommendation
  }
  
}

module.exports = new RecommendationService();
