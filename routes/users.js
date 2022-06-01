var express = require('express');
var router = express.Router();
const user = require('../model/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10;
var sendmail = require('../libs/sendmail');
var random = require('../libs/random');
const a_user = require('../model/userModel')
const CreditCard = require('../model/creditcardModel')
const Trade = require('../model/tradeModel')
const User = require('../model/userModel')
const SMS = require('../model/smsModel')
const fs = require('fs');
const multer = require('multer')
const path = require('path')
const uploader = multer({dest: path.join(__dirname,"..\\uploads")})

/* GET users listing. */
// middleware này dùng để test
router.get('/', function (req, res, next) {
  res.send('No access support')
  //res.render('admin_edit_user');
});

router.get('/:id', (req, res) => {
  res.render('admin_edit_user')
})

router.post('/changepassword', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var findUser = await user.findOneAndUpdate({ phone: req.session.user_id }, { password: hashpasswordnew });
  var result = findUser;
  if (result == null) { 
    res.send(JSON.stringify({ err: true, message: "Bạn không có quyền truy cập vào hệ thống!" }));
    return;
  }
  var match = bcrypt.compareSync(req.body.password0, req.body.password1)
  if (match==null) {
    res.send(JSON.stringify({ err: true, message: "Mật khẩu hiện tại không đúng!" }));
    return;
  }
  var hashpasswordnew = bcrypt.hashSync(req.body.password1, saltRounds);
  var updateUser = await user.findOneAndUpdate({ phone: req.session.user_id }, { password: hashpasswordnew });

  if (updateUser)
    res.send(JSON.stringify({ err: false, message: "Đổi mật khẩu thành công!" }));
  else
    res.send(JSON.stringify({ err: true, message: "Lỗi hệ thống vui lòng thử lại sau!" }));
})

router.post('/deposit', async function (req, res, next) {
  try {
    //console.log("sss")
    let card_id = req.body.deposit_card_id
    let e_date = req.body.deposit_card_date
    let cvv = req.body.deposit_card_cvv
    let amount = req.body.deposit_money

    res.setHeader('Content-Type', 'application/json');

    if (amount < 1) {
      res.send(JSON.stringify({ color: 'red', status: 'Số tiền giao dịch phải lớn hơn 1' }))
      return;
    }

    await CreditCard.findOne({
      sender_id: card_id,
      expiredDate: Date.parse(e_date),
      cvv: cvv
    }).then(async result => {
      if (!result || result.length == 0) {
        res.send(JSON.stringify({ color: 'red', status: 'Thông tin thẻ không hợp lệ.' }))
        return;
      }
      else {
        if (result.limit < amount && result.limit != -1) {
          res.send(JSON.stringify({ color: 'red', status: 'Nạp vượt quá định mức của thẻ.' }))
          return;
        }
        else if (result.balance < amount) {
          res.send(JSON.stringify({ color: 'red', status: 'Số dư thẻ không đủ để nạp' }))
          return;
        }
        else {
          const updateCreditCard = await CreditCard.updateOne(
            { sender_id: card_id },
            { $inc: { balance: -amount } }
          )
          const update_a_user = await a_user.updateOne(
            { phone: req.session.user_id },
            { $inc: { balance: amount } }
          )

          const insertMany = await Trade.insertMany({
            sender_id: req.session.user_oid,
            receiver_id: result._id,
            type: 'Deposit',
            //mobile_card:[{card_id: ""}],
            createdAt: new Date().getTime(),
            status: 'Approve',
            amount: amount,
            description: 'Nạp tiền vào ví ' + req.session.user_id
          });

          var x1 = updateCreditCard;
          var x2 = update_a_user;
          var x3 = insertMany;
          res.send(JSON.stringify({ color: 'green', status: 'Nạp tiền vào ví thành công' }))
          //console.log(x)
          //res.send(JSON.stringify(x[0]));

        }

      }

    })
  }
  catch (e) {
    res.redirect('/')
  }


})

router.post('/withdraw', async function (req, res, next) {
  try {
    let card_id = req.body.card_id2
    let e_date = req.body.card_date2
    let cvv = req.body.card_cvv2
    let amount = req.body.money2
    let desc = req.body.desc2


    res.setHeader('Content-Type', 'application/json');

    if (amount < 1) {
      res.send(JSON.stringify({ color: 'red', status: 'Số tiền giao dịch phải lớn hơn 1' }))
      return;
    }

    await CreditCard.findOne({
      sender_id: card_id,
      expiredDate: Date.parse(e_date),
      cvv: cvv
    }).then(async result => {
      if (!result || result.length == 0) {
        res.send(JSON.stringify({ color: 'red', status: 'Thông tin thẻ không hợp lệ.' }))
        return;
      }
      else {
        if (result.balance < amount * 1.05) {
          res.send(JSON.stringify({ color: 'red', status: 'Số dư thẻ không đủ để nạp' }))
          return;
        }
        else if ((amount % 50000) != 0) {
          console.log(result.balance)
          res.send(JSON.stringify({ color: 'red', status: 'Số tiền rút là bội của 50.000đ' }))
          return;
        }
        else {
          if (amount <= 5000000) {
            const updateCreditCard = await CreditCard.updateOne(
              { sender_id: card_id },
              { $inc: { balance: amount } }
            )
            const update_a_user = await a_user.updateOne(
              { phone: req.session.user_id },
              { $inc: { balance: -amount*1.05 } }
            )
            const insertMany2 = await Trade.insertMany({
              sender_id: req.session.user_oid,
              receiver_id: result._id,
              type: 'Withdraw',
              //mobile_card:[{card_id: ""}],
              createdAt: new Date().getTime(),
              status: 'Approve',
              amount: amount,
              description: desc,
              payer: 'sender'
            });

            var x1 = updateCreditCard;
            var x2 = update_a_user;
            var x3 = insertMany2;
            res.send(JSON.stringify({ color: 'green', status: 'Rút tiền từ ví thành công' }))
          }
          else {
            const insertMany3 = await Trade.insertMany({
              sender_id: req.session.user_oid,
              receiver_id: result._id,
              type: 'Withdraw',
              //mobile_card:[{card_id: ""}],
              createdAt: new Date().getTime(),
              status: 'Waiting',
              amount: amount,
              description: 'Rút tiền từ ví ' + req.session.user_oid,
              payer: 'sender'
            });
            var x4 = insertMany3
            res.send(JSON.stringify({ color: 'green', status: 'Rút tiền thành công. Giao dịch đang chờ xác nhận' }))
          }
          //console.log(x)
          //res.send(JSON.stringify(x[0]));
        }
      }

    })
  }
  catch (e) {
    res.redirect('/')
  }

})

router.post('/transfer', async function (req, res, next) {
  try {
    let t_reveiver_phone = req.body.t_reveiver_phone
    let t_reveiver_desc = req.body.t_reveiver_desc
    let t_reveiver_money = req.body.t_reveiver_money
    let t_reveiver_otp = req.body.t_reveiver_otp
    let t_fee_user = req.body.t_fee_user

    res.setHeader('Content-Type', 'application/json');

    if (t_reveiver_otp == null) {
      res.send(JSON.stringify({ color: 'red', status: 'Thiếu mã OTP' }))
      return;
    } 
    else if (t_reveiver_money < 1) {
      res.send(JSON.stringify({ color: 'red', status: 'Số tiền chuyển phải lớn hơn 1' }))
      return;
    }
    let smsCode = await SMS.findOne({sender_id: req.session.user_id}).lean()
    //console.log(smsCode)

    await a_user.findOne({
      phone: t_reveiver_phone
    }).then(result => {
      if (!result || result.length == 0) {
        res.send(JSON.stringify({ color: 'red', status: 'Thông tin người nhận không hợp lệ' }))
        return;
      }
      else {
        a_user.findOne({
          phone: req.session.user_id
        }).then(async result2 => {
          if (!result2 || result2.length == 0) {
            //console.log(req.session.user_id)
            res.send(JSON.stringify({ color: 'red', status: 'Phiên giao dịch đã hết hạn, vui lòng đăng nhập lại.' }))
            return;
          }
          else {
            //OTP CHECK
            if(t_reveiver_otp!= smsCode.code || new Date().getTime() - smsCode.createdAt >=60000){
              res.send(JSON.stringify({ color: 'red', status: 'OTP không hợp lệ hoặc đã hết hạn.' }))
              return;
            }


            if (t_reveiver_money > 5000000) {
              const trade5m = await Trade.insertMany({
                sender_id: req.session.user_oid,
                receiver_id: result._id,
                mobile_card: [],
                type: 'Transfer',
                createdAt: new Date().getTime(),
                status: 'Waiting',
                amount: t_reveiver_money,
                description: t_reveiver_desc,
                payer: t_fee_user
              })
              var x = trade5m
              res.send(JSON.stringify({ color: 'green', status: 'Đã tạo giao dịch thành công. Chuyển tiền đang chờ xác nhận' }))
              return
            }
            else {
              if (t_fee_user == 'sender') {
                if (result2.balance < t_reveiver_money * 1.05) {
                  res.send(JSON.stringify({ color: 'red', status: 'Số dư không đủ' }))
                  return
                }
                else {
                  const update_sender = await a_user.updateOne(
                    { phone: req.session.user_id },
                    { $inc: { balance: -t_reveiver_money * 1.05 } }
                  )
                  const update_receiver = await a_user.updateOne(
                    { phone: t_reveiver_phone },
                    { $inc: { balance: t_reveiver_money } }
                  )
                  const trade105 = await Trade.insertMany({
                    sender_id: req.session.user_oid,
                    receiver_id: t_reveiver_phone,
                    mobile_card: [],
                    type: 'Transfer',
                    createdAt: new Date().getTime(),
                    status: 'Approve',
                    amount: t_reveiver_money,
                    description: t_reveiver_desc,
                    payer: t_fee_user
                  })

                  var t1 = update_sender;
                  var t2 = update_receiver;
                  var t3 = trade105;

                  res.send(JSON.stringify({ color: 'green', status: 'Giao dịch thành công' }))
                  return;

                }
              }
              //RECEIVER PAYS FEE
              else {
                if (result2.balance < t_reveiver_money) {
                  res.send(JSON.stringify({ color: 'red', status: 'Số dư không đủ' }))
                  return
                }
                else {
                  const update_sender = await a_user.updateOne(
                    { phone: req.session.user_id },
                    { $inc: { balance: -t_reveiver_money } }
                  )
                  const update_receiver = await a_user.updateOne(
                    { phone: t_reveiver_phone },
                    { $inc: { balance: t_reveiver_money * 0.95 } }
                  )
                  const trade095 = await Trade.insertMany({
                    sender_id: req.session.user_oid,
                    receiver_id: t_reveiver_phone,
                    mobile_card: [],
                    type: 'Transfer',
                    createdAt: new Date().getTime(),
                    status: 'Approve',
                    amount: t_reveiver_money,
                    description: t_reveiver_desc,
                    payer: t_fee_user
                  })

                  var t4 = update_sender;
                  var t5 = update_receiver;
                  var t6 = trade095;

                  res.send(JSON.stringify({ color: 'green', status: 'Giao dịch thành công' }))
                  return;
                }
              }
            }
          }

        })

      }
    })
  }
  catch (e) {
    res.redirect('/')
  }

})

const cmndUpload = uploader.fields([{name: 'image1',maxCount: 1},{name:'image2',maxCount:1}])
router.post('/uploadCMND',cmndUpload, async (req,res)=>{
  let image1 = req.files['image1'][0]
  let image2 = req.files['image2'][0]
  let user_id = req.session.user_id
  
  console.log("GET HR")

  console.log("User id :"+user_id)
  //console.log(image1[0].path)


  let user = await User.findOne({phone: user_id}).lean()
  if(!user){
    return res.json({valid: false,message:"Can't find user with id"+user_id})
  }
    console.log(user)
    console.log(user.email)
    console.log(image1)
    console.log(path.extname(image1.path))
    //create folder for user
    let userFolder = path.join(__dirname,'../uploads/'+user.email)
    let image1Sample = path.join(userFolder,'cmnd1'+path.extname(image1.originalname))
    let image2Sample = path.join(userFolder,'cmnd2'+path.extname(image2.originalname))

    console.log(image1Sample)
    console.log(image2Sample)

    if(!fs.existsSync(userFolder)){
      fs.mkdirSync(userFolder, 0744,true);
    }

    /// store image 1
    if(fs.existsSync(user.image1)){
      fs.unlinkSync(user.image1)
    }
    fs.renameSync(image1.path,image1Sample)
    

    /// store image 2
    if(fs.existsSync(user.image2)){
      fs.unlinkSync(user.image2)
    }
    fs.renameSync(image2.path,image2Sample)

    // update path image to database
    const filter = {phone: user_id}
    const update = {image1: 'cmnd1'+path.extname(image1.originalname),image2: 'cmnd2'+path.extname(image2.originalname)}
    User.findOneAndUpdate(filter,update)
    .then(user=>{
      console.log(user)
      return res.json({valid: true,message:"Cập nhập thành công"})
    })
    .catch(err=>{
      console.log(err)
      return res.json({valid: false,message:"Cập nhập thất bại"})
    })
})

router.post('/uploadInformationRegister',cmndUpload, async(req,res)=>{
  let image1 = req.files['image1'][0]
  let image2 = req.files['image2'][0]
  
  console.log("GET HR")
  console.log(req.body)
  console.log(image1)
  console.log(image2)

  let checkPhone = await User.findOne({phone: req.body.phone})
  let checkEmail = await User.findOne({email: req.body.email})
  if(checkPhone){
    return res.json({valid: false,message: req.body.phone+" is already existed."})
  }
  else if(checkEmail){
    return res.json({valid: false,message:req.body.email+" is already existed."})
  }
  else{

    // store image to static
    //create folder for user
    let userFolder = path.join(__dirname,'../uploads/'+req.body.email)
    let image1Sample = path.join(userFolder,'cmnd1'+path.extname(image1.originalname))
    let image2Sample = path.join(userFolder,'cmnd2'+path.extname(image2.originalname))

    console.log(image1Sample)
    console.log(image2Sample)

    if(!fs.existsSync(userFolder)){
      fs.mkdirSync(userFolder, 0744,true);
    }

    /// store image 1
    fs.renameSync(image1.path,image1Sample)

    /// store image 2
    fs.renameSync(image2.path,image2Sample)

    // update database
    await User({firstLogin: true,status: 'Waiting',secure_status: 0,name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    birth: req.body.bdate,
    createdAt: new Date().getTime(),
    image1: 'cmnd1'+path.extname(image1.originalname),
    image2: 'cmnd1'+path.extname(image2.originalname)
    }).save()

    //send email:
    // let link = sendmail.validateRegister(phone,req.body.email)
    //send email:
    let link = sendmail.validateRegister(req.body.phone,req.body.email)
    //redirect to login or first login
    return res.json({valid: true,message: "Mật khẩu tạm thời đã được gửi dưới dạng 6 số vào email của bạn. Vui lòng kiểm tra\n"})
  }
})

router.post('/sendOTP',async (req,res)=>{
  let user = await User.findOne({_id: req.session.user_oid})
  if(!user){
    return res.json({valid: false,message:"Please login to make a transaction"})
  }
  let link = sendmail.sendSMSCode(req.session.user_id,user.email)
  //redirect to login or first login
  return res.json({valid: true,message: "Mã SMS đã gửi đến email của bạn. Dùng OTP code để xác thực giao dịch , mã sẽ hết trong vòng 60s"})
})

// router.get('/card/create', function(req, res, next) {
//   console.log(new Date(2022,9,10).getDate())
//   CreditCard.insertMany([{
//     sender_id: '111111',
//     expiredDate: Date.parse('2022-10-10'),
//     cvv: '411',
//     limit: -1,
//     balance: 10000000
//   }])
//   CreditCard.insertMany([{
//     sender_id: '222222',
//     expiredDate:Date.parse('2022-11-11'),
//     cvv: '443',
//     limit: 1000000,
//     balance: 10000000
//   }])
//   CreditCard.insertMany([{
//     sender_id: '333333',
//     expiredDate: Date.parse('2022-12-12'),
//     cvv: '577',
//     limit: 1000000,
//     balance: 0
//   }])
// })

module.exports = router;
