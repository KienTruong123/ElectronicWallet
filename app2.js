var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var expressHandlebars = require('express-handlebars')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var flash = require('connect-flash');
var session = require('express-session');
var {imageValidator} = require('./validator')
const {validationResult} = require('express-validator')



var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: 'main',
  helpers: {
      ifEquals: function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
      },
  },
}))
app.use(flash());
app.use(session({
  secret: 'kiennguyentrong',
  saveUninitialized: true,
  resave: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//database setup
var opts = {
}
// switch (app.get('env')) {
//     case 'development':
//         mongoose.connect(credentials.mongo.development.connectionString, opts)
//         break;
//     case 'production':
//         mongoose.connect(credentials.mongo.production.connectionString, opts)
//         break;
//     default:
//         throw new Error('Unknown execution environment'+ app.get('env'));
// }

//route setup
app.use(function (req, res, next) {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/admin',(req,res)=>{
  res.render('admin_dashboard')
})

app.get('/upload',(req,res)=>{
    res.render('test',{admin: true})
})

app.use(function (req, res, next) {
  req.flash('admin',true)
  next()
})

app.post('/upload',uploader.fields([{
    name:'image1',maxCount:1
},
{
    name:'image2',maxCount:1
}
]),(req,res)=>{
    console.log(req.image1)
    console.log(req.image2)
    console.log(req.body)
    console.log(req.files)
    //console.log(res.write(req.image1,'binary'))

    
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(8085, () => console.log('http:\\localhost: 8085'))

module.exports = app;
