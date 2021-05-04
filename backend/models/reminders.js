
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('reminders', {
    title: DataTypes.STRING,
    expiration: DataTypes.STRING,
    isDone: DataTypes.BOOLEAN,
  }, {
    underscored: true,
  });
};
