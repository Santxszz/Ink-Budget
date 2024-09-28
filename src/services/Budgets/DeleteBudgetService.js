const Budget = require('../../database/models/Budget')
const Product = require('../../database/models/Product')

exports.DeleteBudgetService = async id => {
  const deleteBudget = await Budget.destroy({ where: { id } })
  return deleteBudget
}
