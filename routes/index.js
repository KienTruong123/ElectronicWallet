var express = require('express');
var router = express.Router();
var sendmail = require('../libs/sendmail');
var random = require('../libs/random');
const bcrypt = require('bcrypt')
const a_user = require('../model/userModel')
const card = require('../model/mobileCardModel')

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'KTM', user: req.session.user });

  if (req.session.user_id) {
    res.render('index', { title: 'KTM', user: req.session.user });
  }
  else {
    return res.redirect('/login')
  }
});

router.get('/login', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { title: 'Login', layout: "login" });
  }
});

router.get('/logout', function (req, res, next) {
  console.log(req.session.user_id)
  if (req.session.user_id) {
    req.session.destroy();
    return res.redirect('/login');
  }
  else {
    return res.redirect('/')
  }
})

router.post('/login', function (req, res, next) {
  let uid = req.body.userid
  let pass = req.body.userpass

  //let hashpass = bcrypt.hashSync(pass, 5)
  //TODO: CHECK USER FIRST LOGIN

  if (uid == 'admin' && pass == '123456') {
    req.session.user_id = 'admin'
    return res.redirect('/admin')
  }

  a_user.findOne({ phone: uid })
    .then(async result => {
      if (!result || result.length === 0) {
        req.session.flash = { type: 'danger', message: 'Sai tài khoản hoặc mật khẩu.' }
        return res.redirect('/login');
      }
      else {
        if (result.secure_status == 6) {
          req.session.flash = { type: 'danger', message: 'Tài khoản của bạn bị Khóa vĩnh viễn' }
          return res.redirect('/login')
        }
        else if (result.secure_status > 2 && (new Date().getTime() - result.lockedAt < 1000 * 60)) {
          req.session.flash = { type: 'danger', message: 'Tài khoản của bạn bị tạm khóa 1 phút' }
          return res.redirect('/login')
        }
        //console.log(pass)
        //console.log(result.password)
        const match = bcrypt.compareSync(pass, result.password)
        //console.log(match)
        if (match) {
          req.session.user_id = uid
          req.session.user_oid = result._id
          req.session.user = result
          await a_user.updateOne({ phone: result.phone }, { secure_status: 0, lockedAt: null })

          if (result.firstLogin == true) {
            return res.redirect('/firstlogin')
          }
          else {
            return res.redirect('/')
          }
        }
        else {
          //console.log('12')
          await a_user.updateOne({ phone: result.phone }, { $inc: { secure_status: 1 } })
          //console.log('12')
          if (result.secure_status <= 1) {
            req.session.flash = { type: 'danger', message: 'Sai tài khoản hoặc mật khẩu' }
          }
          else if (result.secure_status <= 4) {
            await a_user.updateOne({ phone: result.phone }, { lockedAt: new Date().getTime() })
            req.session.flash = { type: 'danger', message: 'Tài khoản của bạn bị tạm khóa 1 phút' }
          }
          else {
            await a_user.updateOne({ phone: result.phone }, { lockedAt: new Date().getTime() })
            req.session.flash = { type: 'danger', message: 'Tài khoản của bạn bị Khóa vĩnh viễn' }
          }
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
  if (req.session.user_id) {
    res.redirect('/')
  }
  else {
    res.render('user/register', { title: 'Register', layout: "login" });
  }
  //sendmail.validateRegister("xxx@mail");
});

// Generate cards
router.get('/card', (req, res) => {
  const cards = []
  for (let index = 0; index < 20; index++) {
    cards.push({ code: random.makeCard("11111", 5), price: 10000 })
    cards.push({ code: random.makeCard("11111", 5), price: 20000 })
    cards.push({ code: random.makeCard("11111", 5), price: 50000 })
    cards.push({ code: random.makeCard("11111", 5), price: 100000 })
  }
  for (let index = 0; index < 20; index++) {
    cards.push({ code: random.makeCard("22222", 5), price: 10000 })
    cards.push({ code: random.makeCard("22222", 5), price: 20000 })
    cards.push({ code: random.makeCard("22222", 5), price: 50000 })
    cards.push({ code: random.makeCard("22222", 5), price: 100000 })
  }
  for (let index = 0; index < 20; index++) {
    cards.push({ code: random.makeCard("33333", 5), price: 10000 })
    cards.push({ code: random.makeCard("33333", 5), price: 20000 })
    cards.push({ code: random.makeCard("33333", 5), price: 50000 })
    cards.push({ code: random.makeCard("33333", 5), price: 100000 })
  }

  (async function () {
    var insertMany = await card.insertMany(cards);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(insertMany));
  })();


})

router.get('/test', (req, res) => {
  sendmail.validateRegister(req.session.user_id,"truongdinh@mail.com");
})


module.exports = router;
