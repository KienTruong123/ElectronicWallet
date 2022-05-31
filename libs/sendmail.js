const nodemailer = require("nodemailer");
const User = require('../model/userModel')
const random = require('../libs/random');
const req = require("express/lib/request");

module.exports.validateRegister= async function (uid, to) {
  let testAccount = await nodemailer.createTestAccount();
  let code = random.makeCard('',6);
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass,
    },
  });

  let info = await transporter.sendMail({
    from: '"K.T.N" <KTN-Service@atm.com>', 
    to: to, 
    subject: "Xác thực mật khẩu", 
    text: "Code xác thực tài khoản KTN:"+ code
  });
  (async function () {
    const filter = {_id: uid}
    const update = {smsCode: code, expiredTim: new Date(new Date().getTime() + 90)}
    let user = await User.findOneAndUpdate(filter,update)
    console.log(user)
  })();
  
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return nodemailer.getTestMessageUrl(info)
}