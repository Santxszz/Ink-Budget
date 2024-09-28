const Budget = require('../database/models/Budget')
const Product = require('../database/models/Product')
const {
  CreateBudgetService,
} = require('../services/Budgets/CreateBudgetService')
const {
  DeleteBudgetService,
} = require('../services/Budgets/DeleteBudgetService')
const { ListBudgetService } = require('../services/Budgets/ListBudgetService')
const { MailBudgetService } = require('../services/Budgets/MailBudgetService')
const {
  NotifyBudgetService,
} = require('../services/Budgets/NotifyBudgetService')
const { ShowBudgetService } = require('../services/Budgets/ShowBudgetService')
const {
  UpdateBudgetService,
} = require('../services/Budgets/UpdateBudgetService')

// Create a Budget
module.exports.createBudget = async (req, res, next) => {
  const { client_name, client_contact_phone, client_email, products_budget } =
    req.body

  const productIds = products_budget
    .split(',')
    .map(id => Number.parseInt(id.trim(), 10))

  let totalPrice = 0
  const productsName = []
  for (let i = 0; i < productIds.length; i++) {
    const products = await Product.findOne({
      where: { id: productIds[i] },
      limit: productIds.length,
    })

    totalPrice = products.product_price + totalPrice
    productsName.push(products.product_name)
  }

  const createBudget = await CreateBudgetService({
    client_name,
    client_contact_phone,
    client_email,
    products_budget,
    total_value: totalPrice,
  })

  return res.status(201).json({
    message: 'Budget Created',
    status: 201,
    info: 'Created',
    budget: {
      'Client Name': client_name,
      'Client Contacts': {
        email: client_email,
        phone: client_contact_phone,
      },
      products: { productsName },
      'Total Budget': totalPrice.toFixed(2),
    },
  })
}

// List Budgets
module.exports.listBudgets = async (req, res, next) => {
  const budgetList = await ListBudgetService()
  if (budgetList.length <= 0) {
    return res.status(404).json({
      message: 'Budgets Not Found.',
      status: 400,
      error: 'Not Found',
    })
  }

  return res.status(200).json(budgetList)
}

// Show Budget
module.exports.showBudget = async (req, res, next) => {
  const id = req.params.id
  const budgetShow = await ShowBudgetService(id)
  if (!budgetShow || budgetShow.length <= 0) {
    return res.status(404).json({
      message: 'Budgets Not Found.',
      status: 400,
      error: 'Not Found',
    })
  }

  return res.status(200).json(budgetShow)
}

// Delete Budget
module.exports.deleteBudget = async (req, res, next) => {
  const id = req.params.id

  const budgetExists = await Budget.findOne({
    where: { id },
  })
  if (!budgetExists) {
    return res.status(404).json({
      message: 'Budgets Not Found.',
      status: 404,
      error: 'Not Found',
    })
  }

  await DeleteBudgetService(id)

  return res.status(204).json()
}

// Update Budget
module.exports.updateBudget = async (req, res, next) => {
  const id = req.params.id
  const client_name = req.body.client_name
  const client_contact_phone = req.body.client_contact_phone
  const client_email = req.body.client_email
  const products_budget = req.body.products_budget
  const total_value = req.body.total_value

  const budgetExists = await Budget.findOne({ where: { id } })
  if (!budgetExists) {
    return res.status(404).json({
      message: 'Budgets Not Found.',
      status: 404,
      error: 'Not Found',
    })
  }

  const productIds = products_budget
    .split(',')
    .map(id => Number.parseInt(id.trim(), 10))

  console.log(productIds)
  let totalPrice = 0
  const productsName = []
  for (let i = 0; i < productIds.length; i++) {
    const products = await Product.findOne({
      where: { id: productIds[i] },
      limit: productIds.length,
    })

    if (!products) {
      return res.status(404).json({
        message: 'Any Product Not Found.',
        status: 404,
        error: 'Not Found',
        info: {
          Proudcts_ID: await Product.findAll({
            attributes: {
              exclude: [
                'product_name',
                'product_cEAN',
                'product_description',
                'product_price',
                'createdAt',
                'updatedAt',
              ],
            },
          }),
        },
      })
    }

    totalPrice = products.product_price + totalPrice
    productsName.push(products.product_name)
  }

  const updatedBudget = await UpdateBudgetService({
    client_name,
    client_contact_phone,
    client_email,
    products_budget,
    total_value: totalPrice,
    id,
  })

  return res.status(200).json({
    message: 'Budgets Updated.',
    status: 200,
    error: 'OK',
  })
}

// Notify Budget
module.exports.notifyBudget = async (req, res, next) => {
  const id = req.params.id

  const budgetExists = await Budget.findOne({ where: { id } })
  if (!budgetExists) {
    return res.status(404).json({
      message: 'Budgets Not Found.',
      status: 404,
      error: 'Not Found',
    })
  }

  const notifyInfo = await NotifyBudgetService(id)
  return res.status(200).json({
    message: 'Budget Notified',
    status: 200,
    info: 'Message Sendend For Client',
    data: notifyInfo,
  })
}

// Mail Budget Notify
module.exports.mailBudget = async (req, res, next) => {
  const id = req.params.id

  const budgetExists = await Budget.findOne({
    where: { id },
  })
  if (!budgetExists) {
    return res.status(404).json({
      message: 'Budgets Not Found.',
      status: 404,
      error: 'Not Found',
    })
  }

  const mail = await MailBudgetService(id)
  return res.status(200).json({
    message: 'Email Sended.',
    status: 200,
    error: 'OK',
  })
}
