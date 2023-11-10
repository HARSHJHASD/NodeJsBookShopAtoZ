// we are requirring the packae here
const Sequelize = require("sequelize");
//here we are requiring the database file where we have created pool of database using sequalise
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING(100),
    unique: true,
    allowNull: false,
  },
});

module.exports = User;
