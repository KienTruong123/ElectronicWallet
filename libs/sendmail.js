
const nodemailer = require("nodemailer");
const sendMail = require('../model/sms');
const User = require('../model/userModel')
const random = require('../libs/random')
const bcrypt = require('bcrypt')

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
    subject: "ElectronicWallet: Xác thực mật khẩu", 
    text: "Mật khẩu tạm thời của bạn là :"+ code
  });
  (async function () {
    var insert = await User.findOneAndUpdate({_id: uid,password: bcrypt.hashSync(code,5)})
    //var insert = await sendMail.insertMany({sender_id:uid,code: bcrypt.hashSync(code,5), createdAt:new Date().getTime() });
    console.log(insert);
  })();

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports.sendSMSCode= async function (uid, to) {
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
    subject: "ElectronicWallet: Xác thực phiên giao dịch", 
    text: "Mã xác thực OTP:"+ code+"\nMã xác thực sẽ hết hiệu lực sau 90s"
  });
  (async function () {
    const filter = {}
    var insert = await sendMail.findOneAndUpdate({sender_id:uid,code:code, createdAt:new Date().getTime() },{upsert: true});
    console.log(insert);
  })();

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
