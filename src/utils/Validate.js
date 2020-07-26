const validateField = function(data) {

            const Schema = {
                name : Joi.string().required(),
                email : Joi.string().required().email(),
                title : Joi.string().required(),
                comment : Joi.string().required(),
                
            };
        return Joi.validate(data, Schema);
}

module.exports = validateField;
