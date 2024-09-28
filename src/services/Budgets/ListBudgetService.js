const Budget = require('../../database/models/Budget')
const Product = require('../../database/models/Product')

exports.ListBudgetService = async () => {
  const listBudgets = await Budget.findAll({
    attributes: { exclude: ['updatedAt', 'createdAt'] },
  })

  for (let i = 0; i < listBudgets.length; i++) {
    listBudgets[i].client_name = { 'Client Name': listBudgets[i].client_name }

    const productIds = listBudgets[i].products_budget
      .split(',')
      .map(id => Number.parseInt(id.trim(), 10))

    const products = await Product.findAll({
      where: { id: productIds },
    })

    const productNames = products.map(product => product.product_name)

    const totalValue = products.reduce((sum, product) => {
      return sum + (product.product_price || 0)
    }, 0)

    listBudgets[i] = {
      id: listBudgets[i].id,
      'Client Information': {
        Name: listBudgets[i].client_name,
        Contacts: {
          Email: listBudgets[i].client_email,
          Phone: listBudgets[i].client_contact_phone,
        },
        'Budgets Items': {
          Products: {
            Name: productNames,
          },
          Qtd_Products: productNames.length,
          Total_Value: totalValue.toFixed(2),
        },
      },
    }
  }

  return listBudgets
}
