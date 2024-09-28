const Product = require('../../database/models/Product')

exports.DeleteProductService = async id => {
  const deleteProduct = await Product.destroy({ where: { id } })
  return deleteProduct
}
