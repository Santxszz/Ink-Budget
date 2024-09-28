const Budget = require('../../database/models/Budget')
const Product = require('../../database/models/Product')

exports.ShowBudgetService = async id => {
  const listBudgets = await Budget.findOne({
    where: { id },
    attributes: { exclude: ['updatedAt', 'createdAt'] },
  })

  listBudgets.client_name = { 'Client Name': listBudgets.client_name }

  const productIds = listBudgets.products_budget
    .split(',')
    .map(id => Number.parseInt(id.trim(), 10))

  const products = await Product.findAll({
    where: { id: productIds },
  })

  const productNames = products.map(product => product.product_name)

  const totalValue = products.reduce((sum, product) => {
    return sum + (product.product_price || 0)
  }, 0)

  const formatedResponse = {
    id: listBudgets.id,
    'Client Information': {
      Name: listBudgets.client_name,
      Contacts: {
        Email: listBudgets.client_email,
        Phone: listBudgets.client_contact_phone,
      },
      'Budgets Items': {
        Products: {
          Name: productNames,
        },
        Qtd_Products: productNames.length,
        Total_Value: totalValue,
      },
    },
  }

  return formatedResponse
}
