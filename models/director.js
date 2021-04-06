const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const DirectorSchema = new Schema({

    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],

})

const Director = mongoose.model('Director', DirectorSchema)
const DirectorTC = compose.composeWithMongoose(Director)

module.exports = {DirectorSchema, Director, DirectorTC}