# cyberbox
The release of cyberbox - an all inclusive file-hosting application

To setup and run the application
   - clone repository
   - cd to *backend*
   - run "npm install"
   - cd to *models*
   - open *db.js*
   - replace placeholder values for database connection

```js
	const sequelize = new Sequelize('REPLACE_HERE_DATABASE_NAME', 'REPLACE_HERE_USER', 'REPLACE_HERE_PASSWORD', {
  		dialect: 'mysql',
  		host: 'localhost',
  		define: {
   		   timestamps: false
  		}
	});
```

   - edit *frontend/js/structure.js* *address* variable with your back-end address
   - cd back to *back* (pun intended)
   - run *npm start*
