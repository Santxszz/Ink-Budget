const twilio = require('twilio')

const Budget = require('../../database/models/Budget')
const Product = require('../../database/models/Product')

const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = twilio(accountSid, authToken)

exports.NotifyBudgetService = async id => {
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

  async function createMessage() {
    const productDetails = formatedResponse['Client Information'][
      'Budgets Items'
    ].Products.Name.map((product, index) => {
      const price = products[index].product_price || 0
      return `- ${product} (R$ ${price.toFixed(2)})`
    }).join('\n')

    const titleBody = `*Orçamento Nº #${formatedResponse.id}*\n*Nome: ${formatedResponse['Client Information'].Name}*\n*Contatos:*\n- 📧 ${formatedResponse['Client Information'].Contacts.Email}\n- 📞 ${formatedResponse['Client Information'].Contacts.Phone}`

    const productsBody = `*📦 Produtos:*\n${productDetails}`

    const valuesBody = `*🔢 QTD. Produtos:* ${formatedResponse['Client Information']['Budgets Items'].Qtd_Products}\n*💰 Valor Total:* R$ ${formatedResponse['Client Information']['Budgets Items'].Total_Value.toFixed(2)}`

    const phoneNumber = listBudgets.client_contact_phone
    console.log(`whatsapp:+${phoneNumber.replace(/\D/g, '')}`)

    await client.messages.create({
      body: titleBody,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+${phoneNumber.replace(/\D/g, '')}`,
    })

    await client.messages.create({
      body: productsBody,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+${phoneNumber.replace(/\D/g, '')}`,
    })

    await client.messages.create({
      body: valuesBody,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+${phoneNumber.replace(/\D/g, '')}`,
    })
  }
  createMessage()

  return formatedResponse
}
