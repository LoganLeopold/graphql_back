const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema
const { MovieQuery } = require('../graph_schemas/movie_gs') 

const { movieByIds } = MovieQuery

const ActorSchema = new Schema({

    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],

})

// const ActorSchema = composeWithMongoose(Actor)


const Actor = mongoose.model('Actor', ActorSchema)
const ActorTC = compose.composeWithMongoose(Actor)
ActorTC.addRelation(
    'Movies',
    {
        resolver: movieByIds,
        prepareArgs: {
            _ids: (source) => source.Movies.map( movie => movie),
            skip: null,
            sort: null
        },
        projection: { Movies: true }
    }
)

module.exports = {ActorSchema, Actor, ActorTC}