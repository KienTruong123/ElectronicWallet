var express = require('express');
var router = express.Router();
var sendmail = require('../libs/sendmail');
var random = require('../libs/random');
const bcrypt = require('bcrypt')
const a_user = require('../model/userModel')
const CreditCard = require('../model/creditcardModel')
const Trade = require('../model/tradeModel')

/* GET users listing. */
// middleware này dùng để test
router.get('/', function(req, res, next) {
  res.send('No access support')
  //res.render('admin_edit_user');
});

router.get('/:id',(req,res)=>{
  res.render('admin_edit_user')
})

router.post('/deposit', async function (req, res, next){
  let card_id = req.body.deposit_card_id
  let e_date = req.body.deposit_card_date
  let cvv = req.body.deposit_card_cvv
  let amount = req.body.deposit_money

  //let is_ok = false

  await CreditCard.findOne({
    sender_id: card_id,
    expiredDate: Date.parse(e_date),
    cvv: cvv
  }).then(result=>{ // <----    result here !!!
    if(!result || result.length==0){
      return res.json({status:'Thông tin thẻ không hợp lệ.'})
    }
    else{
     
      if(result.limit < amount && result.limit!=-1){
        return res.json({status:'Nạp vượt quá định mức của thẻ'})
      }
      else if(result.balance < amount){
        return res.json({status:'Số dư thẻ không đủ để nạp'})
      }
      else{
        console.log("---1"+result)
        CreditCard.updateOne(
          {sender_id: card_id},
          {$inc: {balance: -amount}}
        )
        console.log("---2"+result)
        a_user.updateOne(
          {phone: req.session.user_id},
          {$inc: {balance: amount}}
        )
        //error trade ?
        // console.log("---3"+result)
        // Trade.insertMany({
        //   sender_id: req.session.user_id,
        //   receiver_id: card_id,
        //   type: 'Deposit',
        //   //mobile_card:[{card_id: ""}],
        //   createdAt: new Date().getTime(),
        //   status: 'Approve',
        //   amount: amount,
        //   description: 'Nạp tiền vào ví '+req.session.user_id,
        // })
        console.log("---4"+result)
        return res.json({status:'Nạp thành công'})
      }
    }

  })
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
