const { DataTypes } = require('sequelize')
const db = require('../connect')

const Budget = db.define(
  'Budget',
  {
    client_name: { type: DataTypes.STRING, allowNull: false, require: true }, // Nome do Cliente
    client_contact_phone: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    }, // Contato do Cliente
    client_email: { type: DataTypes.STRING, allowNull: false, require: true }, // Email do Cliente
    products_budget: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    }, // Id dos Produtos do Orçamento
    total_value: { type: DataTypes.FLOAT, allowNull: false, require: true }, // Valor Total do Orçamento
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
)

module.exports = Budget
