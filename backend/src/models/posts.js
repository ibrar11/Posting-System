'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({users,comments}) {
      // define association here
      this.belongsTo(users, {foreignKey: "userId"});
      this.hasMany(comments,
        {
          foreignKey: "postId",
          onDelete: 'CASCADE'
        }
      );
    }

    toJSON() {
      return {...this.get(), pwd: undefined, refreshToken: undefined}
    }
  }
  posts.init({
    post:{
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};