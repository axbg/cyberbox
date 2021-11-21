
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('settings', {
    push: DataTypes.BOOLEAN,
    mail: DataTypes.BOOLEAN,
  }, {
    underscored: true,
  });
};
