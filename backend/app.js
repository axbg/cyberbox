require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const middlewares = require('./controllers/middlewares');
const auth = require('./controllers/auth');

const models = require('./models');
const index = require('./routes/index');

const app = express();

models.sequelize.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.get('/*', function (req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store');
  next();
});

app.post('/*', function (req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store');
  next();
});

app.use(
  session({
    cookieName: 'session',
    secret: 'AUTH_SECRET',
    duration: 432000000, // 5 days
    activeDuration: 172800000, // 2 days
    ephemeral: false,
    secure: false,
  }),
);

app.post('/auth/glogin', auth.gLogin);
app.post('/auth/logout', middlewares.LogInCheck, auth.Logout);

app.use('/api', middlewares.LogInCheck, index);

app.use(express.static(path.resolve(__dirname, '../.', 'frontend')));

app.get('*', function (req, res) {
  res.status(404).send('nothing here for ya mate');
});

module.exports = app;
