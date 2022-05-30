var express = require('express');
var mongoose = require('mongoose')
const { get } = require('express/lib/request');
const { type } = require('express/lib/response');
var router = express.Router();
var User = require('../model/userModel')
var Trade = require('../model/tradeModel')
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
//     name: 'Ductrong 1',
//     phone: '0901346550',
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
//   name: 'Ductrong 2',
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
//   name: 'Ductrong 3',
//   phone: '0901346550',
//   email: 'ductrong1313@gmail.com',
//   birth: '19/05/2001',
//   address: 'TP HCM',
//   balance: 120000,
//   createdAt: new Date().getTime(),
//   status: 'Waiting',
//   secure_status: 6,
//   lockedAt: new Date().getTime()
// }).save()


  // get 5 list 
  let active_list = await User.find({"status":"Active"}).sort({createdAt: 'desc'}).lean()
  let waiting_list = await User.find({"status":{$in:["Waiting","Updating"]}}).sort({createdAt: 'desc'}).lean()
  let ban_list = await User.find({"status":"Ban"}).sort({createdAt: 'desc'}).lean()
  let lock_list = await User.find({secure_status: { $gt: 4 }}).sort({lockedAt: 'asc'}).lean()
  let trade_list = await Trade.find({amount: {$gt: 5000000}}).sort({createdAt: 'desc'}).lean()

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
    req.flash('message',"Something went wrong. Can't find user with id: "+req.params.id) 
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
    return res.json({valid: false,message: "Something went wrong. Can't find user with id "+id})
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
          return res.json({valid: true,message: "User move to active list"})
        else
          return res.json({valid: false,message: "Can't find user with id "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Something went wrong. Can't find user with id "+id})
      })
    }
    else if(type == 'inactive'){
      const filter = { _id: id };
      const update = { status: 'Ban' };
      User.findOneAndUpdate(filter, update)
      .then(user=>{
        if(user)
          return res.json({valid: true,message: "User move to ban list"})
        else
          return res.json({valid: false,message: "Can't find user with id "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Something went wrong. Can't find user with id "+id})
      })
      
    }
    else if(type == 'request'){
      const filter = { _id: id };
      const update = { status: 'Updating' };
      User.findOneAndUpdate(filter, update)
      .then(user=>{
        if(user)
          return res.json({valid: true,message: "User move to waiting list"})
        else
          return res.json({valid: false,message: "Can't find user with id "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Something went wrong. Can't find user with id "+id})
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
          return res.json({valid: true,message: "User move to active list"})
        else
          return res.json({valid: false,message: "Can't find user with id "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Something went wrong. Can't find user with id "+id})
      })
    }
  }
  // secure_status independent with status
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
          return res.json({valid: true,message: "User has been released"})
        else
          return res.json({valid: false,message: "Can't find user with id "+id})
      })
      .catch(err=>{
        return res.json({valid: false,message: "Something went wrong. Can't find user with id "+id})
      })
    }
  }
  else{
    res.json({valid: false,message:"User is "+user.status})
  }
})

router.get('/trades/:id',async (req,res)=>{
  Trade.findOne({_id: req.params.id}).lean()
  .then( async (result)=>{
    console.log("RESULT ne")
    console.log(result)
    if(!result)
      {
        req.flash('message',"Can't find transaction with id: "+req.params.id) 
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
        //conver to VND format 
        trade.amounts =  trade.amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        
        console.log("trade ne")
        console.log(trade)
        //console.log(trade)
        res.render('admin/admin_edit_trade',{trade: trade,admin: true})
      }
  })
  .catch(err=>{
    req.flash('message',"Something went wrong. Can't find transaction with id: "+req.params.id) 
    res.redirect('/admin')
  })
})

router.post('/updateTrade', async (req,res)=>{
  const {id,type} = req.body
  console.log("ID: "+id)
  console.log("type:" +type)

  if(type != 'Approve' && type != 'Reject'){
    return res.json({valid:false,message: 'Transaction only can be approved or rejected.'})
  }

  let trade = await Trade.findOne({_id: id}).exec()
  console.log("Stop here")
  console.log(trade)
  if(!trade){
    return res.json({valid: false,message: "Something went wrong. Can't find transaction with id "+id})
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
            let filter = { _id: t.sender_id };
            let update = { $inc: {balance: - t.amount} };
            await User.findOneAndUpdate(filter,update)

            filter = { _id: t.receiver_id };
            update = { $inc: {balance: + t.amount} };
            await User.findOneAndUpdate(filter,update)

            return res.json({valid: true,message: "Transaction is "+type})
          }
          else{
            return res.json({valid: true,message: "Transaction is "+type})
          }
        }
      else
        return res.json({valid: false,message: "Can't find transaction with id "+id})
    })
    .catch(err=>{
      return res.json({valid: false,message: "Something went wrong. Can't find transaction with id "+id})
    })
  }
  else{
    return res.json({valid: false,message: "Warning ! The transaction is "+trade.status})
  }
})

// Trade({
//   send_id: '62922b2a42eea4507ccb9ff2',
//   receiver_id: '62922b2a42eea4507ccb9ff4',
//   amount: 510000000,
//   status: 'Wait',
//   description: 'For fund',
//   createdAt: new Date().getTime()
// }).save()

module.exports = router;
