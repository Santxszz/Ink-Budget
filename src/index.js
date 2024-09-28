// Techs
const express = require('express')
const dotenv = require('dotenv').config()
const { errors } = require('celebrate')

// Db connection
const dbConnect = require('./database/connect')

// Routes Import
const productRouter = require('./routes/Products/products.routes')
const budgetRouter = require('./routes/Budgets/budgets.routes')

// Instances
const app = express()

// Express Config
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use(productRouter)
app.use(budgetRouter)

// Middleware Celebrate Errors
app.use(errors())

// System Initialize
dbConnect.sync().then(() => {
  app.listen(process.env.portServer)
})
