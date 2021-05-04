
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('permissions', {
    created: DataTypes.STRING,
  }, {
    underscored: true,
  });
};
