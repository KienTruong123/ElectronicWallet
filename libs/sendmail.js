
const nodemailer = require("nodemailer");

module.exports.validateRegister= async function (to) {
  let testAccount = await nodemailer.createTestAccount();

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
    subject: "Hello", 
    text: "Hello world?", 
    html: "<b>Hello world?</b>", 
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
