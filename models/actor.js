const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const ActorSchema = new Schema({
    
    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    
})

const Actor = mongoose.model('Actor', ActorSchema)
const ActorTC = compose.composeWithMongoose(Actor)

module.exports = { ActorSchema, Actor, ActorTC }