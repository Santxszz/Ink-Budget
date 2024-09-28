const { Sequelize } = require("sequelize");
const dotenv = require("dotenv").config();

const sequelize = new Sequelize(
  process.env.dbName,
  process.env.dbUser,
  process.env.dbPass,
  {
    host: process.env.dbHost,
    dialect: "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log(`Conectado ao banco: ${process.env.dbName}`);
} catch (error) {
  console.log(`Não foi possível conectar ao banco. ${error}`);
}

module.exports = sequelize;
