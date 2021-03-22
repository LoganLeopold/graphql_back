const mongoose = require('../db')
const Schema = mongoose.Schema

const Actor = new Schema({

    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],

})

module.exports = mongoose.model('Actor', Actor)