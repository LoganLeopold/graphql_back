const mongoose = require('mongoose')

let uri = process.env.URI

mongoose.connect(uri, {useNewUrlParser: true}).catch( err => console.log(err))

mongoose.Promise = Promise

module.exports = mongoose