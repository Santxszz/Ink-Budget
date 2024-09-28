const Product = require('../../database/models/Product')

exports.CreateProductService = async (
  product_name,
  product_description,
  product_cEAN,
  product_price
) => {
  const createProduct = await Product.create({
    product_name,
    product_description,
    product_cEAN,
    product_price,
  })
  return createProduct
}
