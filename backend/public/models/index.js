
let sequelize = require('./db.js');

let Files = sequelize.import('./files');
let Users = sequelize.import('./users');
let Settings = sequelize.import('./settings');
let Permissions = sequelize.import('./permissions');
let Reminders = sequelize.import('./reminders');
let Notes = sequelize.import('./notes');


Users.hasMany(Files,{onDelete:'cascade'});

Settings.belongsTo(Users,{onDelete:'cascade'});

Permissions.belongsTo(Users, {onDelete:'cascade', as:'owner'});
Permissions.belongsTo(Users, {onDelete:'cascade', as:'friend'});

Users.hasMany(Reminders,{onDelete:'cascade'});
Users.hasMany(Notes, {onDelete: 'cascade'});



module.exports = {

	sequelize,
	Files,
	Users,
	Settings,
	Permissions,
	Reminders,
	Notes
};