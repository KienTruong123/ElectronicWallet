const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TradeSchema = new Schema({
    sender_id: String,
    code: String,
    createdAt: Date,
})

module.exports = mongoose.model('SmsCode', TradeSchema);