var express = require('express');
var router = express.Router();
var sendmail = require('../libs/sendmail');
var random = require('../libs/random');
const bcrypt = require('bcrypt')
const a_user = require('../model/userModel')
const SMS = require('../model/smsModel')

const card = require('../model/mobileCardModel')
const saltRounds = 10;

router.get('/test',(req,res)=>{
  res.render('test', {title:"Yêu cầu lấy lại mật khẩu"});
})


router.get('/reset',(req,res)=>{
  res.render('user/resetpass_otp', {title:"Yêu cầu lấy lại mật khẩu", layout: "login"});
})

router.post('/reset',async (req,res)=>{
  let {email,phone} = req.body
 
  let user = await a_user.findOne({email: email,phone: phone}).lean()
  if(!user){
    return res.json({valid: false,message: "Can't find user with email :"+email+"\n and phone: "+phone})
  }
  else{
    req.session.resetpass_uid = user._id
    sendmail.sendSMSCode(user._id,user.email)
    return res.json({ valid: true, message: "Mã SMS đã gửi đến email của bạn. Dùng mã để nhập vào để khôi phục mật khẩu , mã sẽ hết hạn trong vòng 60s" })
  }
})
router.post('/verify', async (req,res)=>{
  console.log("verify")
  console.log(req.body)
  
  let smsCode = await SMS.findOne({sender_id: req.session.resetpass_uid,code: req.body.reset_otp}).lean()
  if(!smsCode){
    req.session.flash = { type: 'danger', message: 'Mã SMS không tồn tại !' }
    res.redirect('/reset')
  }
  else if((new Date().getTime() - smsCode.createdAt) > 1000 * 60){
    req.session.flash = { type: 'danger', message: 'Mã SMS đã hết hạn !' }
    res.redirect('/reset')
  }
  else{
    console.log(smsCode.sender_id)
    res.redirect('/verify')
  }
})

router.get('/verify',(req,res)=>{

  console.log(req.session.resetpass_uid)
  if(!req.session.resetpass_uid){
    res.redirect('/login')
  }
  else{
    res.render('user/resetpass', {title:"Đổi mật khẩu mới", layout: "login", req_reset: true})
  }
})

router.post('/resetPassword',(req,res)=>{
  if(!req.session.resetpass_uid){
    res.redirect('/login')
  }
  else{
    console.log(req.body)
    let {password1,password2} = req.body
    if(password1 != password2){
      req.session.flash = { type: 'danger', message: 'Mật khẩu không khớp !' }
      res.redirect('/verify')
    }
    const filter = {_id: req.session.resetpass_uid}
    const update = {password: bcrypt.hashSync(req.body.password1,5)}
    a_user.findOneAndUpdate(filter,update)
    .then(user=>{
      if(!user){
        req.session.flash = { type: 'danger', message: 'Không tìm thấy người dùng!' }
        req.session.destroy()
        res.redirect('/reset')
      }
      else{
        req.session.flash = { type: 'success', message: 'Khôi phục mật khẩu thành công !' }
        req.session.destroy()
        res.redirect('/login')
      }
    })
  }
})

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

  if (req.session.user_id == 'admin') {
    res.redirect('/admin')
  }
  else if (req.session.user_id) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { title: 'Login', layout: "login" });
  }
  //check
});


router.get('/firstlogin', function (req, res, next) {
  res.render('user/resetpass', { title: 'First login', layout: "login" });
});

router.post('/firstlogin', async function (req, res, next) {
  var hashpasswordnew = bcrypt.hashSync(req.body.password1, saltRounds);
  var findUser = await a_user.findOneAndUpdate({ phone: req.session.user_id }, { password: hashpasswordnew, firstLogin: false });
  if (findUser) {
    req.session.flash = { type: 'success', message: 'Đổi mật khẩu thành công!' }
    //console.log('hello sussces');
    return res.redirect('/');
  }
  else {
    req.session.flash = { type: 'danger', message: 'Lỗi hệ thống vui lòng thử lại sau!' }
    return res.redirect('/firstlogin');
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

      console.log(result)
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
//     cards.push({ code: random.makeCard("33333", 5), price: 20000 })
//     cards.push({ code: random.makeCard("33333", 5), price: 50000 })
//     cards.push({ code: random.makeCard("33333", 5), price: 100000 })
  }

  (async function () {
    var insertMany = await card.insertMany(cards);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(insertMany));
  })();


})

router.get('/test', (req, res) => {
  sendmail.validateRegister(req.session.user_id, "truongdinh@mail.com");
})


module.exports = router;
