var express = require('express');
const fs = require('fs');
var router = express.Router();
const multer = require('multer')
const path = require('path')
const uploader = multer({dest: path.join(__dirname,"..\\uploads")})
var User = require('../model/userModel')

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
router.post('/upload',cmndUpload, async (req,res)=>{
  let image1 = req.files['image1'][0]
  let image2 = req.files['image2'][0]
  let user_id = req.body.user_id

  console.log("User id :"+user_id)
  //console.log(image1[0].path)


  let user = await User.findOne({_id: user_id}).lean()
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
    const filter = {_id: user_id}
    const update = {image1: 'cmnd1'+path.extname(image1.originalname),image2: 'cmnd2'+path.extname(image2.originalname)}
    User.findOneAndUpdate(filter,update)
    .then(user=>{
      console.log(user)
      return res.json({valid: true,message:"Cập nhập thành công"})
    })
    .catch(err=>{
      return res.json({valid: false,message:"Cập nhập thất bại"})
    })
})



module.exports = router;
