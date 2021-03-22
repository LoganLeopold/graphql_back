const mongoose = require('../db')
const Schema = mongoose.Schema

const Movie = new Schema({

    Name: String,
    Director: {
        type: Schema.Types.ObjectId,
        ref: 'Director'
    },
    Actors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Actor'
        }
    ],

})

module.exports = mongoose.model('Movie', Movie)