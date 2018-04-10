# cyberbox-releases
The official releases of cyberbox - an all inclusive file-hosting application

To setup and run the application

   - clone repository
   
   - create a "files" directory in the root folder (next to 'backend' and 'frontend')
   
   - cd to backend
   
   - run "npm install"
   
   - cd to public/models
   
   - create "db.js"
   
   - append to db.js

	let Sequelize = require('sequelize');
	const sequelize = new Sequelize('cyberbox', 'alex', 'alex', {
  		dialect: 'mysql',
  		host: 'localhost',
  		define: {
   		   timestamps: false
  		}
	});
		
	module.exports = sequelize;

   - edit "frontend/js/structure.js" address value with your localhost
   
   - cd to "backend"
   
   - install nodemon "npm install -g nodemon"
   
   - run "nodemon ./bin/www"
