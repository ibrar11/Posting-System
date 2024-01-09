'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({users,posts}) {
      // define association here
      this.belongsTo(users,{foreignKey: "userId"});
      this.belongsTo(posts),{foreignKey: "postId"};
    }
    toJSON() {
      return {...this.get(), pwd: undefined, refreshToken: undefined}
    }
  }
  comments.init({
    comment:{
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};