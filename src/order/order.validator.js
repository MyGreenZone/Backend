const Joi = require('joi');
const joiMessages = require('../../utils/joiMessages');
const { KEY, OrderStatus } = require('../../constants');

const createOrderValidator = Joi.object({
  deliveryMethod: Joi.string()
    .valid('pickup', 'delivery')
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'any.only': joiMessages.any.only,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),

  fulfillmentDateTime: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'date.base': joiMessages.date.base,
      'date.format': joiMessages.date.format
    }),

  totalPrice: Joi.number()
    .min(0)
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'number.base': joiMessages.number.base,
      'number.min': joiMessages.number.min
    }),

  paymentMethod: Joi.string()
    .valid('online', 'cod')
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'any.only': joiMessages.any.only,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),
  owner: Joi.string()
    .pattern(KEY.OBJECT_ID_PATTERN)
    .optional()
    .messages({
      'any.required': joiMessages.any.required,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),

  consigneeName: Joi.string()
    .when('deliveryMethod', {
      is: 'delivery',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': joiMessages.any.required,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),

  consigneePhone: Joi.string()
    .pattern(/^(03|05|07|08|09)[0-9]{8}$/)
    .when('deliveryMethod', {
      is: 'delivery',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': joiMessages.any.required,
      'string.pattern.base': joiMessages.string.pattern,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),

  shippingAddress: Joi.string()
    .when('deliveryMethod', {
      is: 'delivery',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      'any.required': joiMessages.any.required,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),

  store: Joi.string()
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),

  owner: Joi.string()
    .regex(KEY.OBJECT_ID_PATTERN)
    .messages({
      'string.empty': joiMessages.string.empty,
      'string.pattern.base': 'owner không đúng định dạng ObjectId',
      'string.base': joiMessages.string.base
    }),

  voucher: Joi.string()
    .regex(KEY.OBJECT_ID_PATTERN)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'voucher không đúng định dạng ObjectId',
      'string.base': joiMessages.string.base
    }),

  orderItems: Joi.array()
    .items(
      Joi.object({
        variant: Joi.string()
          .required()
          .pattern(KEY.OBJECT_ID_PATTERN)
          .messages({
            'any.required': joiMessages.any.required,
            'string.empty': joiMessages.string.empty,
            'string.pattern.base': joiMessages.string.pattern,
            'string.base': joiMessages.string.base
          }),

        quantity: Joi.number()
          .integer()
          .min(1)
          .required()
          .messages({
            'any.required': joiMessages.any.required,
            'number.base': joiMessages.number.base,
            'number.min': joiMessages.number.min,
            'number.integer': joiMessages.number.integer
          }),

        price: Joi.number()
          .min(0)
          .required()
          .messages({
            'any.required': joiMessages.any.required,
            'number.base': joiMessages.number.base,
            'number.min': joiMessages.number.min
          }),

        toppingItems: Joi.array()
          .items(
            Joi.object({
              topping: Joi.string()
                .required()
                .pattern(KEY.OBJECT_ID_PATTERN)
                .messages({
                  'any.required': joiMessages.any.required,
                  'string.empty': joiMessages.string.empty,
                  'string.pattern.base': joiMessages.string.pattern,
                  'string.base': joiMessages.string.base
                }),

              quantity: Joi.number()
                .integer()
                .min(1)
                .required()
                .messages({
                  'any.required': joiMessages.any.required,
                  'number.base': joiMessages.number.base,
                  'number.min': joiMessages.number.min,
                  'number.integer': joiMessages.number.integer
                }),

              price: Joi.number()
                .min(0)
                .required()
                .messages({
                  'any.required': joiMessages.any.required,
                  'number.base': joiMessages.number.base,
                  'number.min': joiMessages.number.min
                })
            })
          )
          .optional()
          .messages({
            'array.base': joiMessages.array.base
          })
      })
    )
    .min(1)
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'array.base': joiMessages.array.base
    }),

  latitude: Joi.string()
    .when('deliveryMethod', {
      is: 'delivery',
      then: Joi.required().messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty,
        'string.base': joiMessages.string.base
      }),
      otherwise: Joi.optional()
    }),


  longitude: Joi.string()
    .when('deliveryMethod', {
      is: 'delivery',
      then: Joi.required().messages({
        'any.required': joiMessages.any.required,
        'string.empty': joiMessages.string.empty,
        'string.base': joiMessages.string.base
      }),
      otherwise: Joi.optional()
    })

});

const updateOrderValidator = Joi.object({
  status: Joi.string().trim()
    .required()
    .valid(...OrderStatus.enableUpdateValues())
    .messages({
      'any.required': joiMessages.any.required,
      'any.only': joiMessages.any.only,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),


  shipper: Joi.alternatives().conditional('status', {
    is: Joi.valid('readyForPickup'),
    then: Joi.string().trim().pattern(KEY.OBJECT_ID_PATTERN).optional().messages({
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base,
      'string.pattern.base': 'Field shipper không đúng định dạng ObjectId'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'Không truyền shipper nếu status không phải là readyForPickup'
    })
  }),


  cancelReason: Joi.alternatives().conditional('status', {
    is: Joi.valid('cancelled', 'failedDelivery'),
    then: Joi.string().trim().required().messages({
      'any.required': joiMessages.any.required,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'Không truyền cancelReason nếu status không phải là cancelled hoặc failedDelivery.'
    })
  })

})

const updatePaymentStatusValidator = Joi.object({
  paymentStatus: Joi.string().trim()
    .valid('success', 'failed', 'cancelled')
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'any.only': 'paymentStatus phải là một trong 3 giá trị: success, failed, cancelled',
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),
  transactionId: Joi.string().trim()
    .required()
    .messages({
      'any.required': joiMessages.any.required,
      'string.empty': joiMessages.string.empty,
      'string.base': joiMessages.string.base
    }),
})

module.exports = { createOrderValidator, updateOrderValidator, updatePaymentStatusValidator };
