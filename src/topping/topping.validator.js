const Joi = require('joi')
const joiMessages = require('../../utils/joiMessages')
const { KEY } = require('../../constants')
const toppingValidator = Joi.object({
    password: Joi.string()
        .trim()
        .required()
        .valid(KEY.ADMIN_PASSWORD)
        .messages({
            'any.required': joiMessages.any.required,
            'any.only': joiMessages.any.only,
            'string.empty': joiMessages.string.empty
        }),

    name: Joi.string()
        .trim()
        .pattern(/^(?!\s*$)[a-zA-ZÀ-ỹ\s\-']+$/)
        .min(1)
        .max(100)
        .required()
        .messages({
            'any.required': joiMessages.any.required,
            'string.empty': joiMessages.string.empty
        }),

    extraPrice: Joi.number().
        required().
        integer().
        min(1000).
        messages({
            'any.required': joiMessages.any.required,
            'number.integer': joiMessages.number.integer,
            'number.min': joiMessages.number.min
        })
})

module.exports = toppingValidator 