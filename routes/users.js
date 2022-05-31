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
router.get('/', function (req, res, next) {
  res.send('No access support')
  //res.render('admin_edit_user');
});

router.get('/:id', (req, res) => {
  res.render('admin_edit_user')
})

router.post('/deposit', async function (req, res, next) {
  console.log("sss")
  let card_id = req.body.deposit_card_id
  let e_date = req.body.deposit_card_date
  let cvv = req.body.deposit_card_cvv
  let amount = req.body.deposit_money

  res.setHeader('Content-Type', 'application/json');
  await CreditCard.findOne({
    sender_id: card_id,
    expiredDate: Date.parse(e_date),
    cvv: cvv
  }).then(async result =>  { 
    if (!result || result.length == 0) {
       res.send(JSON.stringify({color:'red', status: 'Thông tin thẻ không hợp lệ.' }))
       return;
    }
    else {
      if (result.limit < amount && result.limit != -1) {
         res.send(JSON.stringify({color:'red', status: 'Nạp vượt quá định mức của thẻ.' }))
         return;
      }
      else if (result.balance < amount) {
         res.send(JSON.stringify({color:'red', status: 'Số dư thẻ không đủ để nạp' }))
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
          sender_id: req.session.user_id,
          receiver_id: card_id,
          type: 'Deposit',
          //mobile_card:[{card_id: ""}],
          createdAt: new Date().getTime(),
          status: 'Approve',
          amount: amount,
          description: 'Nạp tiền vào ví ' + req.session.user_id
        });
      
        var x1 =updateCreditCard;
        var x2 =update_a_user;
        var x3 =insertMany;
        res.send(JSON.stringify({color:'green', status: 'Nạp tiền vào ví thành công' }))
        //console.log(x)
        //res.send(JSON.stringify(x[0]));

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
