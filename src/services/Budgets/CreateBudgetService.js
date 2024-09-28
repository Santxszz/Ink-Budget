const Budget = require('../../database/models/Budget')

exports.CreateBudgetService = async (
  client_name,
  client_contact_phone,
  client_email,
  products_budget,
  total_value
) => {
  const createBudget = await Budget.create(
    client_name,
    client_contact_phone,
    client_email,
    products_budget,
    total_value
  )
  return createBudget
}
