'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({posts,comments}) {
      // define association here
      this.hasMany(posts, {foreignKey: "userId"});
      this.hasMany(comments,{foreignKey: "userId"});
    }
    
    toJSON() {
      return {...this.get(), pwd: undefined, refreshToken: undefined}
    }
  }
  users.init({
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    pwd:{
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "ACTIVATED"
    },
    refreshToken: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};