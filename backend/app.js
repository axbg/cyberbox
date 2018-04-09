
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('client-sessions');
let middlewares = require('./public/controllers/middlewares');
let auth = require('./public/controllers/auth');
let init = require('./public/controllers/init');
//let fileUploader = require('express-fileupload');

let index = require('./routes/index');

let app = express();

//app.use(fileUploader());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/*',function(req,res,next){
    res.header('Cache-Control' , 'no-cache, no-store' );
    next();
});

app.post('/*',function(req,res,next){
    res.header('Cache-Control' , 'no-cache, no-store' );
    next();
});

app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315dfergewegw$!@!24912bbxcbsdgrgpok123+Ijsli;;termgerdfkhmdkrherhhehwemgro8',
    duration: 432000000, //5 days cookie
    activeDuration: 172800000, //2 days renewal
    httpOnly: true,
    ephemeral: false,
    secure: false
}));

app.post('/auth/glogin', auth.gLogin);
app.post('/auth/logout',middlewares.LogInCheck, auth.Logout);
app.post('/init', middlewares.ForceAdmin, init.createDatabase); //will be commented in production

app.use('/api', middlewares.LogInCheck, index);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../.', 'frontend', 'index.html'));
});

app.use(express.static(path.resolve(__dirname, '../.', 'frontend')));

app.get('*', function(req, res){
    res.status(404).send('what???');
});




module.exports = app;
