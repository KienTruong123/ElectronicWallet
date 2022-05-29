var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('user/login', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('user/register', { title: 'Express' });
});

router.get('/profile',(req,res)=>{
  res.render('profile')
})

module.exports = router;
