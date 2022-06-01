var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var hbs = require('express-handlebars')
var credentials = require('./credentials.js')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tradesRouter = require('./routes/trades')
var adminRouter = require('./routes/admin')
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose')

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs.engine( { 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/menu',
  helpers: {
    ifEquals: function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    ifNotEquals: function(arg1, arg2, options) {
      return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
  },
  ifGreater: function(arg1,arg2,options){
    return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
  },
},
} ) );

app.use(flash());
app.use(session({
  secret: 'kiennguyentrong',
  saveUninitialized: true,
  resave: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


//database setup
var opts = {
}
switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts)
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts)
        break;
    default:
        throw new Error('Unknown excution environment'+ app.get('env'));
}

//route setup
app.use(function (req, res, next) {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trades', tradesRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('error')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
