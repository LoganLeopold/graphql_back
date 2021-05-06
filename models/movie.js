const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const { DirectorQuery } = require('../graph_schemas/director.gs')
const { PlatformQuery } = require('../graph_schemas/platform_gs')

const { directorById } = DirectorQuery
const { platformByIds } = PlatformQuery

const { ActorQuery } = require('../graph_schemas/actor_gs')
const { actorByIds } = ActorQuery
console.log(actorByIds)

const MovieSchema = new Schema({

    Name: String,
    Director: {
        type: Schema.Types.ObjectId,
        ref: 'Director'
    },
    Actors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Actor'
        }
    ],
    Platforms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Platform'
        }
    ],
    TomatoPublic: Number,
    TomatoCritic: Number,
    Genres: [],

})

const Movie = mongoose.model('Movie', MovieSchema)
const MovieTC = compose.composeWithMongoose(Movie)
MovieTC.addRelation(
    'Directors',
    {
        resolver: directorById,
        prepareArgs: {
            _ids: (source) => source.Director ,
            skip: null,
            sort: null
        },
        projection: { Director: true }
    }
)
MovieTC.addRelation(
    'Actors',
    {
        resolver: actorByIds,
        prepareArgs: {
            _ids: (source) => source.Actors.map( actor => actor ),
            skip: null,
            sort: null
        },
        projection: { Actors: true }
    }
)
MovieTC.addRelation(
    'Platforms',
    {
        resolver: platformByIds,
        prepareArgs: {
            _ids: (source) => source.Platforms.map( platform => platform),
            skip: null,
            sort: null,
        },
        projection: { Platform: true }
    }
)

module.exports = {MovieSchema, Movie, MovieTC}