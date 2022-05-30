const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MobileCardSchema = new Schema({
    code: {
        type: String,
        unique: true
    },
    price: Number,
    status: { type: Boolean, default: false },
})

module.exports = new mongoose.model('MobileCard',MobileCardSchema);