const mongoose = require('mongoose')

const db = mongoose.connect(process.env.URI)

mongoose.Promise = Promise

module.exports = mongoose