
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notes', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    isFolder: DataTypes.BOOLEAN,
    idParent: DataTypes.INTEGER,
  }, {
    underscored: true,
  });
};
