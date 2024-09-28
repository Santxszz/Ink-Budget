const { Router } = require('express')
const { celebrate, Joi, Segments } = require('celebrate')

const BudgetController = require('../../controllers/BudgetController')

const budgetRouter = Router()

budgetRouter.get('/budget/list', BudgetController.listBudgets)
budgetRouter.get(
  '/budget/show/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  BudgetController.showBudget
)

budgetRouter.post(
  '/budget/create',
  celebrate({
    [Segments.BODY]: {
      client_name: Joi.string().required(),
      client_contact_phone: Joi.string().required(),
      client_email: Joi.string().email().required(),
      products_budget: Joi.string().required(),
    },
  }),
  BudgetController.createBudget
)

budgetRouter.post(
  '/budget/notify/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  BudgetController.notifyBudget
)

budgetRouter.post(
  '/budget/mail/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  BudgetController.mailBudget
)

budgetRouter.put(
  '/budget/update/:id',
  celebrate({
    [Segments.BODY]: {
      client_name: Joi.string().required(),
      client_contact_phone: Joi.string().required(),
      client_email: Joi.string().email().required(),
      products_budget: Joi.string().required(),
    },
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  BudgetController.updateBudget
)

budgetRouter.delete(
  '/budget/delete/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  BudgetController.deleteBudget
)

module.exports = budgetRouter
