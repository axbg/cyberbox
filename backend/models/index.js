const Sequelize = require('sequelize');
const sequelize = require('./db.js');

const Files = require('./files')(sequelize, Sequelize);
const Users = require('./users')(sequelize, Sequelize);
const Settings = require('./settings')(sequelize, Sequelize);
const Permissions = require('./permissions')(sequelize, Sequelize);
const Reminders = require('./reminders')(sequelize, Sequelize);
const Notes = require('./notes')(sequelize, Sequelize);

Users.hasMany(Files, { onDelete: 'cascade' });

Settings.belongsTo(Users, { onDelete: 'cascade' });

Permissions.belongsTo(Users, { onDelete: 'cascade', as: 'owner' });
Permissions.belongsTo(Users, { onDelete: 'cascade', as: 'friend' });

Users.hasMany(Reminders, { onDelete: 'cascade' });
Users.hasMany(Notes, { onDelete: 'cascade' });

module.exports = {
  sequelize,
  Files,
  Users,
  Settings,
  Permissions,
  Reminders,
  Notes,
};
