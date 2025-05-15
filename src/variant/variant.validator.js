const Joi = require('joi')
const { KEY } = require('../../constants')
const joiMessages = require('../../utils/joiMessages')

const variantValidator = Joi.object({
    password: Joi.string()
        .trim()
        .valid(KEY.ADMIN_PASSWORD)
        .messages({
            'any.required': joiMessages.any.required,
            'any.only': joiMessages.any.only,
            'string.empty': joiMessages.string.empty
        }),
    size: Joi.string()
        .trim()
        .valid('S', 'M', 'L', 'XL')
        .label('Size')
        .messages({
            'any.only': 'Size chỉ được phép là một trong các giá trị: S, M, L, XL',
            'string.empty': joiMessages.string.empty
        }),
    sellingPrice: Joi.number().min(1000).messages({
        'number.min': joiMessages.number.min
    }),
    active: Joi.boolean().messages({
        'boolean.base': joiMessages.boolean.base
    })
})

module.exports = variantValidator