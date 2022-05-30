var express = require('express');
var router = express.Router();
const card = require('../model/mobileCardModel')
const trade = require('../model/tradeModel')


/* GET users listing. */
// middleware này dùng để test
router.get('/', function (req, res, next) {
  res.send('No access support')
  //res.render('admin_edit_trade');
});

router.get('/:id', (req, res) => {
  res.render('trade_detail')
})

var value = { 1: 10000, 2: 20000, 3: 50000, 4: 10000 };
router.post('/card', async (req, res) => {
  var val = value[req.body.value];
  console.log(val);
  console.log(req.body.quantity);


  var type = req.body.type
  var update;
  switch (type) {
    case "Viettel":
      update = await card.findOneAndUpdate({ code: { $regex: /^11111/i }, status: false, price: val }, { status: true });
      break;
    case "Mobifone":
      update = await card.findOneAndUpdate({ code: { $regex: /^22222/i }, status: false, price: val }, { status: true });
      break;
    case "Vinaphone":
      update = await card.findOneAndUpdate({ code: { $regex: /^33333/i }, status: false, price: val }, { status: true });
      break;
    default:
      break;
  }
 
  // sender_id: String,
  // receiver_id: String,
  // mobile_card: [
  //     {
  //         card_id: String
  //     }
  // ],
  // type: String,
  // createdAt: Date,
  // status: String,
  // amount: Number,
  // description: String;

  var results = []
  for (let index = 0; index < req.body.quantity; index++) {
    var updateCard = update;
    results.push(updateCard._id);
  }
  const insertMany = await trade.insertMany({receiver_id: req.session.user_id, mobile_card:results, type: "card" });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(insertMany)); 
});

module.exports = router;
