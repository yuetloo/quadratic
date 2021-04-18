const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { verify: verifySession } = require('./middleware/session');
const db = require('./db');
const RandomString = require('randomstring');
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({
  db,
  expiration: 60 * 60 * 1000  // session expires every hour
});
sessionStore.sync();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const searchRouter = require('./routes/search');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout')
const tweetRouter = require('./routes/tweet')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: RandomString.generate(),
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(verifySession);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/tweet', tweetRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({error: { status: res.status, message: err.message }});
});

module.exports = app;
