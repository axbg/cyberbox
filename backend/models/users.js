
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
  }, {
    underscored: true,
  });
};
