
const nodemailer = require("nodemailer");
const sendMail = require('../model/sms');
const random = require('../libs/random')

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
    var insert = await sendMail.insertMany({sender_id:uid,code:code, createdAt:new Date().getTime() });
    console.log(insert);
  })();

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
