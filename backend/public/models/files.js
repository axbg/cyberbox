module.exports = function (sequelize, DataTypes) {
  return sequelize.define('files', {
    name: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    idParent: DataTypes.INTEGER,
    isFolder: DataTypes.BOOLEAN,
    path: DataTypes.STRING,
  }, {
    underscored: true
  });

};