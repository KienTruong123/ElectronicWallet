var express = require('express');
var router = express.Router();
const card = require('../model/mobileCardModel')
const trade = require('../model/tradeModel')

router.get('/deleteTradeCard', (req, res) => {
  (async function () {
    var deleteMany = await trade.deleteMany({ type: "CardPay" });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(deleteMany));
  })();
})

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
var code = { "Viettel": { $regex: /^11111/i }, "Mobifone": { $regex: /^22222/i }, "Vinaphone": { $regex: /^33333/i } }
router.post('/card', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if(req.body.quantity==0){
    res.send(JSON.stringify({ err: true, message: "Vui lòng nhập số lượng" }));
  }
  var val = value[req.body.value];
  var type = req.body.type;
  
  var results = [];
  var find = await card.find({ code: code[type], status: false, price: val }).limit(req.body.quantity);
  var findCards = find;
  console.log(find)

  for (let index = 0; index < findCards.length; index++) {
    var update= await card.updateOne({ _id: findCards[index]._id }, { host: req.session.user_id, status: true });
    console.log(update)
    results.push(findCards[index]._id)
  };
  
  if (results.length == 0) {
    res.send(JSON.stringify({ err: true, message: "Giao dịch thất bại, không còn thẻ loại này trong hệ thống!" }));
    return;
  }

  var insertMany = await trade.insertMany({
    sender_id: req.session.user._id, receiver_id: type,
    mobile_card: results, type: "CardPay", amount: 0,
    createdAt: new Date().getTime(), status: "Successed", 
    description: "Thẻ cào: " + type
  });
  res.send(JSON.stringify(insertMany));
  return;
});

router.post('/history', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var historyTrades = await trade.find({
    "$or": [{
      receiver_id: req.session.user._id
    }, {
      sender_id: req.session.user._id
    }]
  }).sort({ createdAt: 'desc' });
  console.log(historyTrades)
  res.send(JSON.stringify(historyTrades));
})

router.post('/card/detail', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var id = req.body.id;
  findcard = await card.findById(id);
  result = findcard;
  if (result == null) {
    res.send(JSON.stringify({ err: true, message: "Mã thẻ không tồn tại" }));
    return;
  }
  res.send(JSON.stringify(result));
});


module.exports = router;
