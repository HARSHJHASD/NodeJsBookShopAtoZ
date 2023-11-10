//

const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  product_id: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  user_id: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
});

module.exports = Cart;
