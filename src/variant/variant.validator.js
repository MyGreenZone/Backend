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
            'any.required': joiMessages.any.required,
            'any.only': 'Size chỉ được phép là một trong các giá trị: S, M, L, XL',
            'string.empty': joiMessages.string.empty
        }),
    sellingPrice: Joi.number().min(1000).messages({
        'any.required': joiMessages.any.required,
        'number.min': joiMessages.number.min
    }),
    active: Joi.boolean().messages({
        'boolean.base': joiMessages.boolean.base
    })
})

const createVariantValidator = variantValidator.fork(
    ['password', 'size', 'sellingPrice'],
    (schema) => schema.required()
)

module.exports = {variantValidator, createVariantValidator}