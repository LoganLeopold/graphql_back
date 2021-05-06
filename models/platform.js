const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema
const { MovieQuery } = require('../graph_schemas/movie_gs')
const { movieByIds } = MovieQuery

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
PlatformTC.addRelation(
    'Movies',
    {
        resolver: movieByIds,
        prepareArgs: {
            _ids: (source) => source.Movies.map( movie => movie ),
            skip: null,
            sort: null
        },
        projection: { Movies: true }   
    }
)

module.exports = {PlatformSchema, Platform, PlatformTC}