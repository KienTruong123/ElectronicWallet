var express = require('express');
var router = express.Router();

/* GET users listing. */
// middleware này dùng để test
router.get('/', function(req, res, next) {
  res.render('admin_dashboard');
});

router.get('/users/:id',(req,res)=>{
  res.render('admin_edit_user')
})

router.get('/trades/:id',(req,res)=>{
    res.render('admin_edit_trade')
})

module.exports = router;
