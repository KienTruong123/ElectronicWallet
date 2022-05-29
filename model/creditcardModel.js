const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CreditCardSchema = new Schema({
    sender_id: String,
    expiredDate: Date,
    cvv: String,
    limit: Number,
    balance: Number
})

module.exports = new mongoose.model('CreditCard',CreditCardSchema);