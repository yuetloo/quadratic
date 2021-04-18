const db = require('../index');
const { Model, DataTypes } = require('sequelize');

class User extends Model {}

User.init({
  username: DataTypes.STRING,
  followers: DataTypes.INTEGER,
}, {
  db,
  modelName: 'User' 
})

module.exports = User;
