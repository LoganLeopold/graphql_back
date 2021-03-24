const mongoose = require('../db')
const Schema = mongoose.Schema

const Platform = new Schema({

    Name: String,

})

module.exports = mongoose.model('Platform', Platform)