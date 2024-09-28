const Budget = require('../../database/models/Budget')

exports.UpdateBudgetService = async ({
  client_name,
  client_contact_phone,
  client_email,
  products_budget,
  total_value,
  id,
}) => {
  const updateBudget = await Budget.update(
    {
      client_name,
      client_contact_phone,
      client_email,
      products_budget,
      total_value,
    },
    {
      where: { id },
    }
  )
  return updateBudget
}
