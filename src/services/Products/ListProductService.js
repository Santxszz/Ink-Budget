const Product = require('../../database/models/Product')

exports.ListProductService = async () => {
  const listProducts = await Product.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  })
  return listProducts
}
