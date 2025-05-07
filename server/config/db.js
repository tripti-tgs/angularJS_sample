const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("usermanagement", "root", "triveni@123", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
