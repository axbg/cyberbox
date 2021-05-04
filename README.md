# cyberbox
<img src="https://raw.githubusercontent.com/axbg/cyberbox/master/frontend/img/icons/144.png?token=AF6UYGJHLVGSYBXXPMGFWEC7SCPF2">

#
## The first version of cyberbox - a platform for students which features file hosting & sharing, note-taking and quick notifications

The app was developed during my second year at university as part of BUES' Student Scientific Communication Sessions 2018 organized by The Faculty of Economic Cybernetics, Statistics and Informatics and won the third place

### rebuit from scratch & improved @ [devclub1](https://github.com/devclub1)

#
### Deployment
To setup and run the application
   - clone the repository
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

   - replace the `#GOOGLE_CLIENT_PUBLIC_ID#` placeholder in `front/index.html` with the intended value ([more details here](https://developers.google.com/identity/sign-in/web/sign-in))
   - cd back to *back* (pun intended)
   - run *npm start*
