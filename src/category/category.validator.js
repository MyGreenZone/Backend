const Joi = require('joi')
const joiMessages = require('../../utils/joiMessages')

const createCategoryValidator = Joi.object({
    password: Joi.string()
        .trim()
        .valid('admin123')
        .required()
        .messages({
            'any.required': joiMessages.any.required,
            'any.only': joiMessages.any.only,
            'string.empty': joiMessages.string.empty
        }),
    name: Joi.string().label('Tên danh mục').trim().required().messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),

    icon: Joi.string().trim().uri().required().messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty
    }),
})



module.exports = {createCategoryValidator }