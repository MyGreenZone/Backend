const Joi = require('joi');
const joiMessages = require('../../utils/joiMessages')

const updateProfileValidator = Joi.object({
    firstName: Joi.string().trim().optional()
        .messages({
            'string.base': joiMessages.string.base,
        }),
    lastName: Joi.string().trim().required()
        .messages({
            'string.base': joiMessages.string.base,
            'any.required': joiMessages.any.required,
            'string.empty': joiMessages.string.empty,
        }),
    email: Joi.string().trim().email().optional()
        .messages({
            'string.base': joiMessages.string.base,
            'string.email': joiMessages.string.email,
        }),
    gender: Joi.string().trim().optional().valid('male', 'female', 'other')
        .messages({
            'string.base': joiMessages.string.base,
            'any.only': joiMessages.any.only,
        }),
    avatar: Joi.string().trim().optional()
        .messages({
            'string.base': joiMessages.string.base,
        }),
});

module.exports = {
    updateProfileValidator
}
