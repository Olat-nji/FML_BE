const Joi = require('joi')
const CustomError = require('../utils/CustomError')

class Validator{

    async validateEmail(req,res, next){
        const schema = {
            email : Joi.string().email().required(),
        }
        const result = Joi.validate(req.body, schema)
        if(result.error) throw new CustomError(result.error.message, 400)
        next()
    }
}

module.exports =  new Validator()