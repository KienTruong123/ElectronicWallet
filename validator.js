const {check} = require('express-validator')

exports.loginValidator = [

    check('email').exists().withMessage('Please enter email.')
    .notEmpty().withMessage("Email can't be blank.")
    .isEmail().withMessage('Email is invalid.'),

    check('password').exists().withMessage('Please enter password.')
    .notEmpty().withMessage("Password can't be blank.")
    .custom(value=>{
        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/

        if((regex.test(value)))
            return true;
        else
            throw new Error('Password must  contain at least 8 characters include at least 1 letter and 1 number.')
    }),
]

exports.registerValidator = [
    check('username').exists().withMessage('Please enter username.')
    .notEmpty().withMessage("Username can't be blank.")
    .isLength({min: 5}).withMessage('Length of username must higher or equal to 5.'),

    check('email').exists().withMessage('Please enter email.')
    .notEmpty().withMessage("Email can't be blank.")
    .isEmail().withMessage('Email is invalid.'),

    check('password').exists().withMessage('Please enter password.')
    .notEmpty().withMessage("Password can't be blank.")
    .custom(value=>{
        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/


        if((regex.test(value)))
            return true;
        else
            throw new Error('Password must  contain at least 8 characters include at least 1 letter and 1 number.')
    }),

    check('confirmPassword').exists().withMessage('Please enter password confirm.')
    .notEmpty().withMessage("Password confirm can't be blank.")
    .custom((value,{req})=>{
        if(req.body.password != value){
            throw new Error("Password doesn't match with confirm.")
        }
        return true;
    })
]

exports.resetPassword =[

    check('old-password').exists().withMessage('Please enter password.')
    .notEmpty().withMessage("Password can't be blank.")
    .custom(value=>{
        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/


        if((regex.test(value)))
            return true;
        else
            throw new Error('Password must  contain at least 8 characters include at least 1 letter and 1 number.')
    }),

    check('new-password').exists().withMessage('Please enter password.')
    .notEmpty().withMessage("Password can't be blank.")
    .custom(value=>{
        let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}/


        if((regex.test(value)))
            return true;
        else
            throw new Error('Password must  contain at least 8 characters include at least 1 letter and 1 number.')
    }),

    check('confirmPassword').exists().withMessage('Please enter password confirm.')
    .notEmpty().withMessage("Password confirm can't be blank.")
    .custom((value,{req})=>{
        if(req.body.password != value){
            throw new Error("Password doesn't match with confirm.")
        }
        return true;
    })
]


