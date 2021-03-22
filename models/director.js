const mongoose = require('../db')
const Schema = mongoose.Schema

const Director = new Schema({

    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],

})

module.exports = mongoose.model('Director', Director)