<<<<<<< HEAD
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
=======
# cyberbox
The release of cyberbox - an all inclusive file-hosting application

To setup and run the application
   - clone repository
   - cd to *back*
   - run "npm install"
   - cd to *public/models*
   - open *db.js*
   - replace placeholder values for database connection

```js
	const sequelize = new Sequelize('REPLACE_HERE_DATABASE_NAME', 'REPLACE_HERE_USER', 'REPLACE_HERE_PASSWORD', {
>>>>>>> cd3d578... Created README.md & updated .gitignore
  		dialect: 'mysql',
  		host: 'localhost',
  		define: {
   		   timestamps: false
  		}
	});
<<<<<<< HEAD
		
	module.exports = sequelize;

   - edit "frontend/js/structure.js" address value with your localhost
   
   - cd to "backend"
   
   - install nodemon "npm install -g nodemon"
   
   - run "nodemon ./bin/www"
=======
```

   - edit *front/js/structure.js* *address* variable with your back-end address
   - cd back to *back* (pun intended)
   - run *npm start*
>>>>>>> cd3d578... Created README.md & updated .gitignore
