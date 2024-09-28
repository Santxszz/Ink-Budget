const nodemailer = require('nodemailer')

const Budget = require('../../database/models/Budget')
const Product = require('../../database/models/Product')

exports.MailBudgetService = async id => {
  const listBudgets = await Budget.findOne({
    where: { id },
    attributes: { exclude: ['updatedAt', 'createdAt'] },
  })

  const productIds = listBudgets.products_budget
    .split(',')
    .map(id => Number.parseInt(id.trim(), 10))

  const products = await Product.findAll({
    where: { id: productIds },
  })

  let qtdProducts = 0
  const productNames = products
    .map((product, index) => {
      const price = products[index].product_price || 0
      qtdProducts += 1
      return `${products[index].product_name} (R$ ${price.toFixed(2)})`
    })
    .join(' ')

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

  const transport = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.mailer_user,
      pass: process.env.mailer_pass,
    },
  })

  transport
    .sendMail({
      from: `Central de Orçamentos <${process.env.mailer_user}>`,
      to: `${listBudgets.client_email}`,
      subject: `Orçamento Nº#${listBudgets.id}`,
      html: `
          <h4> Olá, ${listBudgets.client_name} </h4>

          <h4> Suas Informações </h4>
          <h5> Email: ${listBudgets.client_email} </h5>
          <h5> contato: ${listBudgets.client_contact_phone} </h5>

          <h4> Produtos </h4>
          <h5> ${productNames}</h5>

          <h4> Valores e Quantidades </h4>
          <h5> Qtd: ${qtdProducts}x </h5>
          <h5> Valor: R$${totalValue.toFixed(2)} </h5>

          <footer>
              <p> Atenciosamente,<br>Central de Orçamentos </p>
          </footer>
        `,
    })
    .then(response => {
      console.log(`Email enviado: ${response}`)
    })
    .catch(err => {
      console.log(err)
    })

  return formatedResponse
}
