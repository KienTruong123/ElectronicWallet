var express = require('express');
var router = express.Router();
var sendmail = require('../libs/sendmail');
const bcrypt = require('bcrypt')

const a_user = require('../model/userModel')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { title: 'Login', layout: "login" });
  }
});

router.post('/login', function (req, res, next) {
  let uid = req.body.userid
  let pass = req.body.userpass

  //let hashpass = bcrypt.hashSync(pass, 5)
  //console.log(hashpass)

  //TODO: CHECK USER FIRST LOGIN

  a_user.findOne({phone: uid})
    .then(result => {
      console.log(result)
      if (!result || result.length === 0) {
        req.session.flash = { type: 'danger', message: 'Sai tài khoản hoặc mật khẩu.' }
        return res.redirect('/login')
      }
      else {
        const match = bcrypt.compareSync(pass, result.password)
        console.log(match)
        if (match) {
          req.session.user_id = uid
          return res.redirect('/')
        }
        else {
          req.session.flash = { type: 'danger', message: 'Sai tài khoản hoặc mật khẩu' }
          return res.redirect('/login')
        }
      }
    })
    .catch(err => {
      req.session.flash = { type: 'danger', message: err }
        return res.redirect('/login')
    })

  //const match = bcrypt.compareSync(req.body.password, hashed)

})


router.get('/register', function (req, res, next) {
  console.log(req.session.id)
  sendmail.validateRegister("xxx@mail");
  res.render('user/register', { title: 'Register', layout: "login" });
});

router.get('/profile', (req, res) => {
  res.render('profile')
})

module.exports = router;
