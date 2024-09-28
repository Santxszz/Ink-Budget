const { where } = require('sequelize')
const Product = require('../../database/models/Product')

exports.UpdateProductService = async (
  product_name,
  product_description,
  product_cEAN,
  product_price,
  id
) => {
  const updateProduct = await Product.update(
    { product_name, product_description, product_cEAN, product_price },
    { where: { id } }
  )
  return updateProduct
}
