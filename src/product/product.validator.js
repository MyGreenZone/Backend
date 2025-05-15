// product.validator.js
const Joi = require('joi')
const { KEY } = require('../../constants')
const joiMessages = require('../../utils/joiMessages')

const baseProductValidator = Joi.object({
    password: Joi.string()
        .trim()
        .required()
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
    description: Joi.string().trim().required().min(1).max(2000).messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),
    image: Joi.string().uri().trim().required().min(1).max(500).messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),
    sellingPrice: Joi.number().min(1000).messages({
        'any.required': joiMessages.any.required,
        'number.min': joiMessages.number.min
    }),
    sizes: Joi.array().items(
        Joi.object({
            size: Joi.string()
                .trim()
                .required()
                .valid('S', 'M', 'L', 'XL')
                .label('Size')
                .messages({
                    'any.required': joiMessages.any.required,
                    'any.only': 'Size chỉ được phép là một trong các giá trị: S, M, L, XL',
                    'string.empty': joiMessages.string.empty
                }),
            sellingPrice: Joi.number().min(1000).required().messages({
                'any.required': joiMessages.any.required,
                'number.min': joiMessages.number.min
            })
        })
    ).messages({
        'array.base': joiMessages.array.base
    }),
    categoryIds: Joi.array().items(
        Joi.string().trim().regex(KEY.OBJECT_ID_PATTERN).messages({
            'string.pattern.base': 'categoryId không đúng định dạng'
        })
    ).messages({
        'array.base': joiMessages.array.base
    }),
    toppingIds: Joi.array().items(
        Joi.string().trim().regex(KEY.OBJECT_ID_PATTERN).messages({
            'string.pattern.base': 'toppingId không đúng định dạng'
        })
    ).messages({
        'array.base': joiMessages.array.base
    })
})


const patchProductValidator = baseProductValidator.fork(
    ['name', 'description', 'image', 'sellingPrice', 'categoryIds', 'toppingIds'],
    (schema) => schema.optional()
)



module.exports = { baseProductValidator, patchProductValidator }
