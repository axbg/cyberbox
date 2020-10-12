
const sequelize = require('./db.js');

const Files = sequelize.import('./files');
const Users = sequelize.import('./users');
const Settings = sequelize.import('./settings');
const Permissions = sequelize.import('./permissions');
const Reminders = sequelize.import('./reminders');
const Notes = sequelize.import('./notes');

Users.hasMany(Files, {onDelete: 'cascade'});

Settings.belongsTo(Users, {onDelete: 'cascade'});

Permissions.belongsTo(Users, {onDelete: 'cascade', as: 'owner'});
Permissions.belongsTo(Users, {onDelete: 'cascade', as: 'friend'});

Users.hasMany(Reminders, {onDelete: 'cascade'});
Users.hasMany(Notes, {onDelete: 'cascade'});


module.exports = {

  sequelize,
  Files,
  Users,
  Settings,
  Permissions,
  Reminders,
  Notes,
};
