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
  var type = req.body.type;
  var update;
  var rcid;
  switch (type) {
    case "Viettel":
      rcid="Viettel";
      update = await card.findOneAndUpdate({ code: { $regex: /^11111/i }, status: false, price: val }, { host: req.session.user_id, status: true });
      break;
    case "Mobifone":
      rcid="Mobifone";
      update = await card.findOneAndUpdate({ code: { $regex: /^22222/i }, status: false, price: val }, { host: req.session.user_id, status: true });
      break;
    case "Vinaphone":
      rcid="Vinaphone";
      update = await card.findOneAndUpdate({ code: { $regex: /^33333/i }, status: false, price: val }, { host: req.session.user_id, status: true });
      break;
    default:
      break;
  };
  var results = []
  for (let index = 0; index < req.body.quantity; index++) {
    var updateCard = update;
    if (updateCard != null)
      results.push(updateCard._id);
  }

  res.setHeader('Content-Type', 'application/json');
  if (results.length == 0) {
    res.send(JSON.stringify({ err: true, message: "Giao dịch thất bại, không còn thẻ loại này trong hệ thống!" }));
    return;
  }
  console.log(req.session.user)
  var insertMany = await trade.insertMany({sender_id : req.session.user_id,receiver_id:rcid, mobile_card: results, type: "CardPay", amount: 0, createdAt: new Date().getTime(), status:"Successed" });
  res.send(JSON.stringify(insertMany));
});

router.post('/history', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var historyTrades = await trade.find({
    "$or": [{
      receiver_id: req.session.user_id
    }, {
      sender_id: req.session.user_id
    }]
  }).sort({ createdAt: 'desc' });
  console.log(historyTrades)
  res.send(JSON.stringify(historyTrades));
})

module.exports = router;