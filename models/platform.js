const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const PlatformSchema = new Schema({

    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]

})

const Platform = mongoose.model('Platform', PlatformSchema)
const PlatformTC = compose.composeWithMongoose(Platform)

module.exports = {PlatformSchema, Platform, PlatformTC}