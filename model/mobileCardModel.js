const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MobileCardSchema = new Schema({
    host: String,
    host_id: String,
    code: String,
    price: Number
})

module.exports = new mongoose.model('MobileCard',MobileCardSchema);