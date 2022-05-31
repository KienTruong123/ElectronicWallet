var express = require('express');
var router = express.Router();
const user = require('../model/userModel')
const bcrypt = require('bcrypt')
const saltRounds = 10;

/* GET users listing. */
// middleware này dùng để test
router.get('/', function (req, res, next) {
  res.send('No access support')
  //res.render('admin_edit_user');
});

router.get('/:id', (req, res) => {
  res.render('admin_edit_user')
})

router.post('/changepassword', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  var findUser = await user.findOneAndUpdate({ phone: req.session.user_id }, { password: hashpasswordnew });
  var result = findUser;
  if (result == null) { 
    res.send(JSON.stringify({ err: true, message: "Bạn không có quyền truy cập vào hệ thống!" }));
    return;
  }
  var match = bcrypt.compareSync(req.body.password0, req.body.password1)
  if (match==null) {
    res.send(JSON.stringify({ err: true, message: "Mật khẩu hiện tại không đúng!" }));
    return;
  }
  var hashpasswordnew = bcrypt.hashSync(req.body.password1, saltRounds);
  var updateUser = await user.findOneAndUpdate({ phone: req.session.user_id }, { password: hashpasswordnew });

  if (updateUser)
    res.send(JSON.stringify({ err: false, message: "Đổi mật khẩu thành công!" }));
  else
    res.send(JSON.stringify({ err: true, message: "Lỗi hệ thống vui lòng thử lại sau!" }));
})

module.exports = router;
