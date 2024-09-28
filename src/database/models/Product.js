const { DataTypes } = require('sequelize')
const db = require('../connect')

const Product = db.define(
  'Product',
  {
    product_name: { type: DataTypes.STRING, allowNull: false, require: true }, // Nome do Produto
    product_description: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    }, // Descrição do Produto
    product_cEAN: { type: DataTypes.STRING, allowNull: false, require: true }, // Código de Barras
    product_price: { type: DataTypes.FLOAT, allowNull: false, require: true }, // Preço do Produto
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
)

module.exports = Product
