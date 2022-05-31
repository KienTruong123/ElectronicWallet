var express = require('express');
var mongoose = require('mongoose')
const { get } = require('express/lib/request');
const { type } = require('express/lib/response');
var router = express.Router();
var User = require('../model/userModel')
var Trade = require('../model/tradeModel')
var CreditCard = require('../model/creditCardModel')
const moment = require('moment');
const res = require('express/lib/response');


moment.locale('vi');  

/* GET users listing. */
// middleware này dùng để test

router.use(function (req, res, next) {
  req.flash('admin',true)
  next()
})


router.get('/', async function(req, res, next) {
  req.flash('admin',true)

//   User({
//     name: 'a',
//     phone: '0901346450',
//     email: 'ductrong23813@gmail.com',
//     birth: '19/05/2001',
//     address: 'TP HCM',
//     balance: 120000,
//     createdAt: new Date().getTime(),
//     status: 'Waiting',
//     secure_status: 0,
//     lockedAt: new Date().getTime()
// }).save()

// User({
//   name: 'b',
//   phone: '0901346550',
//   email: 'ductrong2313@gmail.com',
//   birth: '19/05/2001',
//   address: 'TP HCM',
//   balance: 120000,
//   createdAt: new Date().getTime(),
//   status: 'Ban',
//   secure_status: 0,
//   lockedAt: new Date().getTime()
// }).save()

// User({
//   name: 'c',
//   phone: '0901346530',
//   email: 'ductrong1313@gmail.com',
//   birth: '19/05/2001',
//   address: 'TP HCM',
//   balance: 120000,
//   createdAt: new Date().getTime(),
//   status: 'Waiting',
//   secure_status: 6,
//   lockedAt: new Date().getTime()
// }).save()

// User({
//   name: 'd',
//   phone: '0911346450',
//   email: 'ductrong2a3813@gmail.com',
//   birth: '19/05/2001',
//   address: 'TP HCM',
//   balance: 120000,
//   createdAt: new Date().getTime(),
//   status: 'Waiting',
//   secure_status: 0,
//   lockedAt: new Date().getTime()
// }).save()

// User({
// name: 'e',
// phone: '0601342550',
// email: 'ductrong23a3@gmail.com',
// birth: '19/05/2001',
// address: 'TP HCM',
// balance: 120000,
// createdAt: new Date().getTime(),
// status: 'Ban',
// secure_status: 0,
// lockedAt: new Date().getTime()
// }).save()

// User({
// name: 'f',
// phone: '0701346430',
// email: 'ductrong13a3@gmail.com',
// birth: '19/05/2001',
// address: 'TP HCM',
// balance: 120000,
// createdAt: new Date().getTime(),
// status: 'Waiting',
// secure_status: 6,
// lockedAt: new Date().getTime()
// }).save()


  // get 5 list 
  let active_list = await User.find({"status":"Active"}).sort({createdAt: 'desc'}).lean()
  let waiting_list = await User.find({"status":{$in:["Waiting","Updating"]}}).sort({createdAt: 'desc'}).lean()
  let ban_list = await User.find({"status":"Ban"}).sort({createdAt: 'desc'}).lean()
  let lock_list = await User.find({secure_status: { $gt: 4 }}).sort({lockedAt: 'asc'}).lean()
  let restrictType = ["Withdraw","Transfer"]
  // because deposit higher than 5.000.000 VND is allow 
  let trade_list = await Trade.find({amount: {$gt: 5000000},type :{$in : restrictType}}).sort({createdAt: 'desc'}).lean()

  for(var i=0;i<active_list.length;i++){
    active_list[i].createdAt =moment(active_list[i].createdAt).format('L') +' '+ moment(active_list[i].createdAt).format('LTS');
  }
  for(var i=0;i<waiting_list.length;i++){
    waiting_list[i].createdAt =moment(waiting_list[i].createdAt).format('L') +' '+ moment(waiting_list[i].createdAt).format('LTS');  
  }
  for(var i=0;i<ban_list.length;i++){
    ban_list[i].createdAt =moment(ban_list[i].createdAt).format('L') +' '+ moment(ban_list[i].createdAt).format('LTS');  
  }
  for(var i=0;i<lock_list.length;i++){
    lock_list[i].lockedAt =moment(lock_list[i].lockedAt).format('L') +' '+ moment(lock_list[i].lockedAt).format('LTS');  
  }
  for(var i=0;i<trade_list.length;i++){

    if(type=="Withdraw"){
      let sender =  await User.find({_id: trade_list[i].sender_id}).lean()
      //let receiver = await CreditCard.find({_id: trade_list[i].receiver_id}).lean()
      trade_list[i].sender_name = sender[0].name
      trade_list[i].receiver_name = "Bank"
    }
    // type == Transfer
    else{
      let sender =  await User.find({_id: trade_list[i].sender_id}).lean()
      let receiver = await User.find({_id: trade_list[i].receiver_id}).lean()
      trade_list[i].sender_name = sender[0] != undefined ? sender[0].name : "unknown"
      trade_list[i].receiver_name = receiver[0] != undefined ? receiver[0].name : "unknown"
    }
    let sender =  await User.find({_id: trade_list[i].sender_id}).lean()
    let receiver = await User.find({_id: trade_list[i].receiver_id}).lean()
    trade_list[i].sender_name = sender[0].name
    trade_list[i].receiver_name = receiver[0].name
    // conver to VND format 
    trade_list[i].amount = trade_list[i].amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    trade_list[i].createdAt = moment(lock_list[i].createdAt).format('L') +' '+ moment(trade_list[i].createdAt).format('LTS');  
  }

  res.render('admin/admin_dashboard',{active_list,waiting_list,ban_list,lock_list,trade_list,admin: true});
});



router.get('/users/:id', async (req,res)=>{

  User.findOne({_id: req.params.id}).lean()
  .then( async (result)=>{
    if(!result)
      {
        req.flash('message',"Can't find user with id: "+req.params.id) 
        res.redirect('/admin')
        
      }
      else{
        let user = result
        let lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth()-1)
        let list = await Trade.find({$or: [
          { 'sender_id': req.params.id },
          { 'receiver_id': req.params.id }
        ],createdAt: { $lte: new Date(), $gte: lastMonth }}).lean()

        let trade_list = JSON.parse(JSON.stringify(list));
        
        for(var i=0;i<trade_list.length;i++){
          let sender =  await User.find({_id: trade_list[i].sender_id}).lean()
          let receiver = await User.find({_id: trade_list[i].receiver_id}).lean()
          trade_list[i].sender_name = sender[0] === undefined ? "Unknown" : sender[0].name != undefined ? sender[0].name : "Unknown"
          trade_list[i].receiver_name = receiver[0] === undefined ? "Unknown" : receiver[0].name != undefined ? receiver[0].name : "Unknown"
          trade_list[i].createdAt = moment(trade_list[i].createdAt).format('L') +' '+ moment(trade_list[i].createdAt).format('LTS');


          //conver to VND format 
          trade_list[i].amount =  trade_list[i].amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});

        }

        console.log("asansa")
        console.log(trade_list)
        res.render('admin/admin_edit_user',{user: user,admin: true,trade_list: trade_list})
      }
  })
  .catch(err=>{
    console.log(err)
    req.flash('message',"Có lỗi xảy ra. Không tìm thấy người dùng với id: "+req.params.id) 
    res.redirect('/admin')
  })
})

router.post('/updateUser',async (req,res)=>{
  const {id,type} = req.body
  console.log("ID: "+id)
  console.log("type:" +type)

  let user = await User.findOne({_id: id}).exec()
  console.log("Stop here")
  console.log(user)
  if(!user){
    return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy người dùng với id: "+id})
  }
  console.log(user.status)
  console.log(user.secure_status)

  if(user.status == "Active"){

  }
  else if(user.status == 'Waiting' || user.status == 'Updating'){
    if(type == 'active'){
      const filter = { _id: id };
      const update = { status: 'Active' };
      User.findOneAndUpdate(filter, update)
      .then(user=>{
        if(user)
          return res.json({valid: true,message: "Người dùng đã được kích hoạt"})
        else
          return res.json({valid: false,message: "Không tìm thấy người dùng với id: "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy người dùng với id: "+id})
      })
    }
    else if(type == 'inactive'){
      const filter = { _id: id };
      const update = { status: 'Ban' };
      User.findOneAndUpdate(filter, update)
      .then(user=>{
        if(user)
          return res.json({valid: true,message: "Người dùng đã vị vô hiệu hóa"})
        else
          return res.json({valid: false,message: "Không tìm thấy người dùng với id: "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy người dùng với id: "+id})
      })
      
    }
    else if(type == 'request'){
      const filter = { _id: id };
      const update = { status: 'Updating' };
      User.findOneAndUpdate(filter, update)
      .then(user=>{
        if(user)
          return res.json({valid: true,message: "Người dùng đã đưa vào danh sách đợi cập nhật"})
        else
          return res.json({valid: false,message: "Không tìm thấy người dùng với id "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy người dùng với id: "+id})
      })
    }
  }
  else if(user.status == 'Ban'){
    if(type == 'recover'){
      const filter = { _id: id };
      const update = { status: 'Waiting' };
      User.findOneAndUpdate(filter, update)
      .then(user=>{
        if(user)
          return res.json({valid: true,message: "Người dùng được đưa vào danh sách đợi"})
        else
          return res.json({valid: false,message: "Không tìm thấy người dùng với id: "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy người dùng với id: "+id})
      })
    }
  }
  // secure_status independent with status
  else{
    console.log("go to here")
  console.log(user.secure_status > 5)
  if(user.secure_status > 5){
    if(type == 'unlock'){

      const filter = { _id: id };
      const update = { secure_status: 0 };
      User.findOneAndUpdate(filter, update)
      .then(user=>{
        console.log("User ne")
        console.log(user)
        if(user)
          return res.json({valid: true,message: "Người dùng đã được mở khóa"})
        else
          return res.json({valid: false,message: "Không tìm thấy người dùng với id: "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy người dùng với id: "+id})
      })
    }
  }
    else{
      res.json({valid: false,message:"User is "+user.status})
    }
  }
})

router.get('/trades/:id',async (req,res)=>{
  Trade.findOne({_id: req.params.id}).lean()
  .then( async (result)=>{
    console.log("RESULT ne")
    console.log(result)
    if(!result)
      {
        req.flash('message',"Có lỗi xảy ra. Không tìm thấy giao dịch với id:: "+req.params.id) 
        res.redirect('/admin')
        
      }
      else{
        // avoid pointer usage so that we use loop

        let trade = {}
        for (var x in result) 
          trade[x] = result[x];


         

        let sender =  await User.find({_id: result.sender_id}).lean()
        let receiver = await User.find({_id: result.receiver_id}).lean()
        trade.sender_name = sender[0].name != undefined ? sender[0].name : "Unknown"
        trade.receiver_name = receiver[0].name != undefined ? receiver[0].name : "Unknown"
        trade.sender_balance = sender[0].balance.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        trade.receiver_balance = receiver[0].balance.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        trade.sender_email = sender[0].email != undefined ? sender[0].email : "Unknown"
        trade.receiver_email = receiver[0].email != undefined ? receiver[0].email : "Unknown"
        trade.createdAt = moment(trade.createdAt).format('L') +' '+ moment(trade.createdAt).format('LTS');
        //calculate transaction fee
        trade.fee = (trade.amount * 0.05).toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        //conver to VND format 
        trade.amount =  trade.amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        
        console.log("trade ne")
        console.log(trade)
        //console.log(trade)
        res.render('admin/admin_edit_trade',{trade: trade,admin: true})
      }
  })
  .catch(err=>{
    req.flash('message',"Có lỗi xảy ra. Không tìm thấy giao dịch với id: "+req.params.id) 
    res.redirect('/admin')
  })
})

router.post('/updateTrade', async (req,res)=>{
  const {id,type} = req.body
  console.log("ID: "+id)
  console.log("type:" +type)

  if(type != 'Approve' && type != 'Reject'){
    return res.json({valid:false,message: 'Giao dịch chỉ có thể được Duyệt hoặc Từ Chối.'})
  }

  let trade = await Trade.findOne({_id: id}).exec()
  console.log("Stop here")
  console.log(trade)
  if(!trade){
    return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy giao dịch với id:"+id})
  }
  console.log(trade.status)

  const filter = { _id: id };
  const update = { status: type };
  if(trade.status=='Waiting'){
    Trade.findOneAndUpdate(filter, update)
    .then(async t=>{
      if(t)
        {
          if(type == 'Approve'){

            // from wallet to bank
            if(t.type == 'Withdraw'){
              let filter = { _id: t.sender_id };
              let update = { $inc: {balance: - t.amount} };
              await User.findOneAndUpdate(filter,update)
  
              filter = { _id: t.receiver_id };
              update = { $inc: {balance: + t.amount} };
              await CreditCard.findOneAndUpdate(filter,update)

              //Update fee transaction to sender:
              // because as Withdraw , the fee payer is always sender(user)
              let fee = t.amount * 0.05
              filter = { _id: t.sender_id };
              update = { $inc: {balance: - fee} };
              await User.findOneAndUpdate(filter,update) 
            }


            // // from bank to wallet
            // else if(t.type == 'Deposit'){
            //   let filter = { _id: t.sender_id };
            //   let update = { $inc: {balance: - t.amount} };
            //   await CreditCard.findOneAndUpdate(filter,update)
  
            //   filter = { _id: t.receiver_id };
            //   update = { $inc: {balance: + t.amount} };
            //   await User.findOneAndUpdate(filter,update)
            // }


            // between person to person
            else if(t.type == 'Transfer'){
              let filter = { _id: t.sender_id };
              let update = { $inc: {balance: - t.amount} };
              await User.findOneAndUpdate(filter,update)
  
              filter = { _id: t.receiver_id };
              update = { $inc: {balance: + t.amount} };
              await User.findOneAndUpdate(filter,update)

              
            // Update Fee of transaction to person who is fee payer
              if(t.payer == "receiver"){
                let fee = t.amount * 0.05
                let filter = { _id: t.receiver_id };
                let update = { $inc: {balance: - fee} };
                await CreditCard.findOneAndUpdate(filter,update)
              }
              else{
                let fee = t.amount * 0.05
                let filter = { _id: t.sender_id };
                let update = { $inc: {balance: - fee} };
                await CreditCard.findOneAndUpdate(filter,update)
              }
            }

            return res.json({valid: true,message: "Transaction is "+type})
          }
          else{
            return res.json({valid: true,message: "Transaction is "+type})
          }
        }
      else
        return res.json({valid: false,message: "Không tìm thấy người dùng với id: "+id})
    })
    .catch(err=>{
      return res.json({valid: false,message: "Có lỗi xảy ra. Không tìm thấy giao dịch với id: "+id})
    })
  }
  else{
    return res.json({valid: false,message: "Warning ! The transaction is "+trade.status})
  }
})

// router.get('/upload',(req,res)=>{
//   res.render('test',{admin: true})
// })

// const cmndUpload = uploader.fields([{name: 'image1',maxCount: 1},{name:'image2',maxCount:1}])

// router.post('/upload',cmndUpload, async (req,res)=>{

//   console.log(req.files)
//   console.log(Buffer.from(req.files['image1']))

//   //console.log(res.write(req.image1,'binary'))
//   const filter = {_id: req.body.user_id}
//   const update = {image1: req.files['image1'], image2: req.files['image2']}
//   await User.findOneAndUpdate(filter,update)
//   .then(user=>{
//     if(user)
//       return res.json({valid: true,message:"Cập nhật CMND thành công "})
//     else
//       return res.json({valid: true,message:"Không thể tìm thấy người dùng với id:"+req.body.user_id})
//   .catch(err=>{
//     return res.json({valid: true,message:"Có lỗi xảy ra. Không thể cập nhật CMND vào lúc này."})
//   })
//   })
// })

// Trade({
//   send_id: '62922b2a42eea4507ccb9ff2',
//   receiver_id: '62922b2a42eea4507ccb9ff4',
//   amount: 510000000,
//   status: 'Wait',
//   description: 'For fund',
//   createdAt: new Date().getTime()
// }).save()

module.exports = router;
