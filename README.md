# cyberbox
<img src="https://raw.githubusercontent.com/axbg/cyberbox/master/frontend/img/icons/144.png?token=AF6UYGJHLVGSYBXXPMGFWEC7SCPF2">

#
## The first version of cyberbox - a platform for students which features file hosting & sharing, note-taking and quick notifications

The app was developed during my second year at university as part of BUES' Student Scientific Communication Sessions 2018 organized by The Faculty of Economic Cybernetics, Statistics and Informatics and won the third place

#
### Deployment
To setup and run the application
   - clone the repository
   - cd to *backend*
   - run "npm install"
   - replace placeholder values in **/backend/.env** with your actual values
```properties
DB_HOST=localhost
DB_NAME=cyberbox
DB_USER=root
DB_PASSWORD=root_password
GOOGLE_CLIENT_ID=SOME_GOOGLE_CLIENT_ID
```
   - *if you don't know how to obtain a GOOGLE_CLIENT_ID, you can find more details here](https://developers.google.com/identity/sign-in/web/sign-in)*
   - run *npm start*
