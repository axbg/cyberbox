let Sequelize = require('sequelize');
const sequelize = new Sequelize('db-name', 'db-user', 'db-password', {
	dialect: 'mysql',
	host: 'localhost',
	define: {
	   timestamps: false
	}
});
	
module.exports = sequelize;