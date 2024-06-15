'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userID'
      })
    }
  }
  Todo.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    isComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Todo',
    tableName: 'Todos'
  })
  return Todo
}
