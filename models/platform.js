const mongoose = require('../db')
const Schema = mongoose.Schema

const Platform = new Schema({

    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]

})

module.exports = mongoose.model('Platform', Platform)