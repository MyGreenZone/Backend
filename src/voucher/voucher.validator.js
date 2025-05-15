const Joi = require('joi')
const { KEY } = require('../../constants')
const joiMessages = require('../../utils/joiMessages')

const voucherValidator = Joi.object({
    password: Joi.string()
        .trim()
        .valid(KEY.ADMIN_PASSWORD)
        .messages({
            'any.required': joiMessages.any.required,
            'any.only': joiMessages.any.only,
            'string.empty': joiMessages.string.empty
        }),

    name: Joi.string().trim().required().min(1).max(100).messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),
    image: Joi.string().uri().trim().required().min(1).max(500).messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),
    description: Joi.string().trim().required().min(1).max(2000).messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),
    code: Joi.string().trim().required().min(1).max(50).messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),
    voucherType: Joi.valid('global', 'seed').required().messages({
        'any.required': joiMessages.any.required,
        'any.only': 'voucherType chỉ được phép là một trong các giá trị: global, seed',
        'string.empty': joiMessages.string.empty
    }),
    discountType: Joi.valid('percentage', 'fixedAmount').required().messages({
        'any.required': joiMessages.any.required,
        'any.only': 'discountType chỉ được phép là một trong các giá trị: percentage, fixedAmount',
        'string.empty': joiMessages.string.empty
    }),
    value: Joi.number().min(1).messages({
        'any.required': joiMessages.any.required,
        'number.min': joiMessages.number.min
    }),
    requiredPoints: Joi.number().min(0).messages({
        'any.required': joiMessages.any.required,
        'number.min': joiMessages.number.min
    }),
    startDate: Joi.date().iso().required().messages({
        'any.required': joiMessages.any.required
    }),
    endDate: Joi.date().iso().required().greater(Joi.ref('startDate')).messages({
        'any.required': joiMessages.any.required,
        'date.greater': 'endDate phải sau startDate'
    }),
    status: Joi.valid('active', 'inactive').required().messages({
        'any.required': joiMessages.any.required,
        'any.only': 'voucherType chỉ được phép là một trong các giá trị: active, inactive',
        'string.empty': joiMessages.string.empty
    }),

})


module.exports = voucherValidator