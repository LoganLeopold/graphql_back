const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const DirectorSchema = new Schema({

    name: String,
    modelName: {
        type: String,
        default: "directors",
        required: '{PATH} is required!',
        immutable: true,
    },
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],

})

const directors = mongoose.model('directors', DirectorSchema)
const DirectorTC = compose.composeWithMongoose(directors)

module.exports = {DirectorSchema, directors, DirectorTC}