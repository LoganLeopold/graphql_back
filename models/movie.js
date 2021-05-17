const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const MovieSchema = new Schema({

    name: String,
    modelName: {
        type: String,
        default: "movies",
        required: '{PATH} is required!',
        immutable: true,
    },
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

const movies = mongoose.model('movies', MovieSchema)
const MovieTC = compose.composeWithMongoose(movies)

module.exports = { MovieSchema, movies, MovieTC }