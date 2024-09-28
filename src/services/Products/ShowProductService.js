const Product = require('../../database/models/Product')

exports.ShowProductService = async id => {
  const showProduct = await Product.findOne({
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  })
  return showProduct
}
