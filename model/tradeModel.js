const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TradeSchema = new Schema({
    sender_id: String,
    receiver_id: String,
    mobile_card: Array,
    type: String,
    createdAt: Date,
    status: String,
    amount: Number,
    description: String,
})


module.exports = new mongoose.model('Trade',TradeSchema);