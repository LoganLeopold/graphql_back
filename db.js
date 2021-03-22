const mongoose = require('mongoose')

mongoose.connect(process.env.URI).then(response => console.log(response)).catch( err => console.log(err))

mongoose.Promise = Promise

module.exports = mongoose