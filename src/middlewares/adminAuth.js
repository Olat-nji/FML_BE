const jwt = require("jsonwebtoken");
const User = require("./../models/User");
const CustomError = require("./../utils/CustomError");

function auth(roles = []) {
     return async (req, res, next) => {
          console.log(req.headers.authorization)
          if (!req.headers.authorization) throw new CustomError("unauthorized user", 401);

          const token = req.headers.authorization.split(" ")[1];
          const decoded = await jwt.verify(token, process.env.JWT_SECRET);

          let user = ""
          if (decoded.role == "admin") {
               user = await User.findOne({ _id: decoded.id });
          } else {
            throw new CustomError("unauthorized user", 401);
          }

          //check if user exists and active
          if (!user || !user.isActive) throw new CustomError("unauthorized user", 401);

          //check if user has permission
          if (roles.length && !roles.includes(user.role)) throw new CustomError("unauthorized user", 401);
          
          //save decoded toeknt to request object
          req.user = decoded;

          next();
     }
}


module.exports = auth;