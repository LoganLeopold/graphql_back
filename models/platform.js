const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const PlatformSchema = new Schema({

    name: String,
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]

})

const platforms = mongoose.model('Platform', PlatformSchema)
const PlatformTC = compose.composeWithMongoose(platforms)

module.exports = {PlatformSchema, platforms, PlatformTC}