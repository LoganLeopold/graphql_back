const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const ActorSchema = new Schema({
    
    name: String,
    modelName: {
        type: String,
        default: "actors",
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

const actors = mongoose.model('actors', ActorSchema)
const ActorTC = compose.composeWithMongoose(actors)

module.exports = { ActorSchema, actors, ActorTC }