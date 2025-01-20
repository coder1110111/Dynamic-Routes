const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  //title: Sequelize.STRING,    //If you dont want to assign a model for this we can give one liner statement
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl : {
    allowNull: false,
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;