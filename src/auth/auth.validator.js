const Joi = require('joi')
const joiMessages = require('../../utils/joiMessages')

const employeeLoginValidator = Joi.object({
    phoneNumber: Joi.string().trim()
        .required()
        .pattern(/^(03|05|07|08|09)[0-9]{8}$/)
        .messages({
            'string.base': joiMessages.string.base,
            'any.required': joiMessages.any.required,
            'string.pattern.base': 'Số điện thoại có 10 chữ số, bắt đầu bằng đầu 03, 05, 07, 08, 09',
            'string.empty': joiMessages.string.empty
        }),

    password: Joi.string().trim()
        .required()
        .messages({
            'string.base': joiMessages.string.base,
            'any.required': joiMessages.any.required,
            'string.empty': joiMessages.string.empty
        })
})

module.exports = { employeeLoginValidator }