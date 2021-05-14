const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const ActorSchema = new Schema({
    
    name: String,
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    
})

const actors = mongoose.model('Actor', ActorSchema)
const ActorTC = compose.composeWithMongoose(actors)

module.exports = { ActorSchema, actors, ActorTC }