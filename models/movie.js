const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const MovieSchema = new Schema({

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
    Platforms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Platform'
        }
    ],
    TomatoPublic: Number,
    TomatoCritic: Number,
    Genres: [],

})

const Movie = mongoose.model('Movie', MovieSchema)
const MovieTC = compose.composeWithMongoose(Movie)

module.exports = {MovieSchema, Movie, MovieTC}