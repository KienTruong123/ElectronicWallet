var express = require('express');
const fs = require('fs');
var router = express.Router();
const multer = require('multer')
const path = require('path')
const uploader = multer({dest: path.join(__dirname,"..\\uploads")})
var User = require('../model/userModel')
var Trade = require('../model/tradeModel')
const bcrypt = require('bcrypt')
const saltRounds = 10;
var sendmail = require('../libs/sendmail');
var random = require('../libs/random');
const { connected } = require('process');

/* GET users listing. */
// middleware này dùng để test
router.get('/', function(req, res, next) {
  res.send('No access support')
  //res.render('admin_edit_user');
});

// router.get('/:id',(req,res)=>{
//   res.render('')
// })




router.get('/upload',(req,res)=>{
  res.render('test',{admin: true})
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
  if(checkPhone){
    return res.json({valid: true,message: req.body.phone+" is already existed."})
  }
  else if(checkEmail){
    let checkEmail = await User.findOne({email: req.body.email})
    return res.json({valid: true,message:req.body.email+" is already existed."})
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
    email: req.body,
    phone: req.body.phone,
    address: req.body.address,
    birth: req.body.bdate,
    createdAt: new Date().getTime(),
    image1: 'cmnd1'+path.extname(image1.originalname),
    image2: 'cmnd1'+path.extname(image2.originalname)
    }).save()

    //send email:


    //redirect to login or first login
  }
})


module.exports = router;
