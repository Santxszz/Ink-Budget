const { Router } = require('express')
const { celebrate, Joi, Segments } = require('celebrate')

const ProductController = require('../../controllers/ProductController')

const productRouter = Router()

productRouter.get('/products/list', ProductController.listProduct)
productRouter.get(
  '/products/list/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  ProductController.showProduct
)

productRouter.post(
  '/products/create',
  celebrate({
    [Segments.BODY]: {
      product_name: Joi.string().required(),
      product_description: Joi.string().required(),
      product_cEAN: Joi.string().required(),
      product_price: Joi.number().min(1).required(),
    },
  }),
  ProductController.createProduct
)

productRouter.put(
  '/products/update/:id',
  celebrate({
    [Segments.BODY]: {
      product_name: Joi.string().required(),
      product_description: Joi.string().required(),
      product_cEAN: Joi.string().required(),
      product_price: Joi.number().min(1).required(),
    },
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  ProductController.updateProduct
)

productRouter.delete(
  '/products/delete/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  ProductController.deleteProduct
)

module.exports = productRouter
