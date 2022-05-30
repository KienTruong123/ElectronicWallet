var express = require('express');
var router = express.Router();
var sendmail = require('../libs/sendmail');
var random = require('../libs/random');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('user/login', { title: 'Login', layout: "login" });
});

router.get('/register', function(req, res, next) {
  console.log(req.session.id)
  sendmail.validateRegister("xxx@mail");
  res.render('user/register', { title: 'Register', layout: "login" });
});

router.get('/card',(req,res)=>{
  console.log(random.makeCard("11111",5))
  res.render('user/register')
})

module.exports = router;
