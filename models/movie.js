const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema
const { DirectorQuery: { directorByIds } } = require('../graph_schemas/director.gs')
const { ActorQuery } = require('../graph_schemas/actor_gs')
const { PlatformQuery: { platformByIds } } = require('../graph_schemas/platform_gs')

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
        resolver: directorByIds,
        prepareArgs: {
            _ids: (source) => source.Directors.map( director => director ),
            skip: null,
            sort: null
        },
        projection: { Directors: true }
    }
)
MovieTC.addRelation(
    'Actors',
    {
        resolver: ActorQuery.actorByIds,
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
            _ids: (source) => source.Platforms.map( platform => platform._id ),
            skip: null,
            sort: null,
        },
        projection: { Platform: true }
    }
)


module.exports = {MovieSchema, Movie, MovieTC}