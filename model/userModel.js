const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    phone: {
        type: String,
        unique: true
    },
    birth: String,
    address: String,
    balance: Number,
    createdAt: Date,
    status: String,
    secure_status: Number,
    lockedAt: Date,
    smsCode: String,
    expiredTime: Date,
})

module.exports = new mongoose.model('a_user',UserSchema);