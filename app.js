require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const favicon = require('serve-favicon');
const flash = require('express-flash');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const pocetnaRouter = require('./routes/pocetna');
const predavanjeRouter = require('./routes/predavanje');
const adminRouter = require('./routes/admin');

var app = express();
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(flash());
app.use(session({
  store: new pgSession({
    conString: `postgres://postgres:${process.env['PGPASSWORD']}@localhost/postgres`
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

//var csrf = require('csurf');

//app.use(csrf());

app.use(passport.authenticate('session'));
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
// app.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/pocetna', pocetnaRouter);
app.use('/predavanje', predavanjeRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use('*', function (req, res, next) {
  res.render('error404', { title: 'Not found'})
})

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
