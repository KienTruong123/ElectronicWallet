var express = require('express');
var router = express.Router();

/* GET users listing. */
// middleware này dùng để test
router.get('/', function(req, res, next) {
  res.send('No access support')
  //res.render('admin_edit_user');
});

router.get('/:id',(req,res)=>{
  res.render('admin_edit_user')
})

module.exports = router;
