const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const MovieSchema = new Schema({

    name: String,
    directors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Director'
        }
    ],
    actors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Actor'
        }
    ],
    platforms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Platform'
        }
    ],
    tomatopublic: Number,
    tomatocritic: Number,
    genres: [],

})

const movies = mongoose.model('Movie', MovieSchema)
const MovieTC = compose.composeWithMongoose(movies)

module.exports = { MovieSchema, movies, MovieTC }