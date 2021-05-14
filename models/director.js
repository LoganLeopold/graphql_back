const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const DirectorSchema = new Schema({

    name: String,
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],

})

const directors = mongoose.model('Director', DirectorSchema)
const DirectorTC = compose.composeWithMongoose(directors)

module.exports = {DirectorSchema, directors, DirectorTC}