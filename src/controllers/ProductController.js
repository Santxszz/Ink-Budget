const Product = require('../database/models/Product')

const CreateProductService = require('../services/Products/CreateProductService')
const DeleteProductService = require('../services/Products/DeleteProductService')
const ListProductService = require('../services/Products/ListProductService')
const {
  ShowProductService,
} = require('../services/Products/ShowProductService')
const {
  UpdateProductService,
} = require('../services/Products/UpdateProductService')

// List Products
module.exports.listProduct = async (req, res, next) => {
  const listProducts = await ListProductService.ListProductService()
  if (listProducts.length <= 0) {
    return res.status(404).json({
      message: 'Products not found.',
      status: 404,
      error: 'Not found.',
    })
  }

  return res.status(200).json(listProducts)
}

// Show Product by Id
module.exports.showProduct = async (req, res, next) => {
  const id = req.params.id

  const productExists = await Product.findOne({ where: id })
  if (!productExists) {
    return res.status(404).json({
      message: 'Product not found.',
      status: 404,
      error: 'Not found.',
    })
  }

  const showProduct = await ShowProductService(id)

  return res.status(200).json(showProduct)
}

// Create a Product
module.exports.createProduct = async (req, res, next) => {
  const { product_name, product_description, product_cEAN, product_price } =
    req.body

  if (product_price <= 0) {
    return res.status(201).json({
      message: 'Product Price Incorrect',
      status: 400,
      info: 'Bad Request',
    })
  }

  const ceanExists = await Product.findOne({ where: { product_cEAN } })
  if (ceanExists) {
    return res.status(201).json({
      message: 'Product Cean Already in Use!',
      status: 400,
      info: 'Bad Request',
    })
  }

  await CreateProductService.CreateProductService(
    product_name,
    product_description,
    product_cEAN,
    product_price
  )

  return res.status(201).json({
    message: 'Product Created.',
    status: 201,
    info: 'Created',
  })
}

// Update a Product
module.exports.updateProduct = async (req, res, next) => {
  const { product_name, product_description, product_cEAN, product_price } =
    req.body
  const { id } = req.params

  const productExists = await Product.findOne({ where: { id } })
  if (!productExists) {
    return res.status(404).json({
      message: 'Product not found.',
      status: 404,
      error: 'Not found.',
    })
  }

  if (product_price <= 0) {
    return res.status(404).json({
      message: 'Product Price Incorrect.',
      status: 400,
      error: 'Bad Request',
    })
  }

  const productCeanExists = await Product.findOne({ where: { product_cEAN } })
  if (productCeanExists && product_cEAN !== productExists.product_cEAN) {
    return res.status(400).json({
      message: 'Product CEAN Already in Use.',
      status: 400,
      info: 'Bad Request',
    })
  }

  const updateProduct = await UpdateProductService(
    product_name,
    product_description,
    product_cEAN,
    product_price,
    id
  )

  return res.status(200).json({
    message: 'Product Updated.',
    status: 200,
    info: 'OK',
  })
}

// Delete a Product
module.exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params
  const productExists = await Product.findOne({ where: { id } })
  if (!productExists) {
    return res.status(404).json({
      message: 'Product not found.',
      status: 404,
      error: 'Not found.',
    })
  }
  await DeleteProductService.DeleteProductService(id)
  return res.status(204).json()
}
