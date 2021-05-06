const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema

const { DirectorQuery } = require('./director')
const { PlatformQuery } = require('./platform')

const { directorById } = DirectorQuery
const { platformByIds } = PlatformQuery

const { ActorQuery } = require('./actor')
const { actorByIds } = ActorQuery

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

const MovieQuery = {
    movieById: MovieTC.getResolver('findById'),
    movieByIds: MovieTC.getResolver('findByIds'),
    movieOne: MovieTC.getResolver('findOne'),
    movieMany: MovieTC.getResolver('findMany'),
    movieCount: MovieTC.getResolver('count'),
    movieConnection: MovieTC.getResolver('connection'),
    moviePagination: MovieTC.getResolver('pagination'),
};

const MovieMutation = {
    movieCreateOne: MovieTC.getResolver('createOne'),
    movieCreateMany: MovieTC.getResolver('createMany'),
    movieUpdateById: MovieTC.getResolver('updateById'),
    movieUpdateOne: MovieTC.getResolver('updateOne'),
    movieUpdateMany: MovieTC.getResolver('updateMany'),
    movieRemoveById: MovieTC.getResolver('removeById'),
    movieRemoveOne: MovieTC.getResolver('removeOne'),
    movieRemoveMany: MovieTC.getResolver('removeMany'),
};

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

module.exports = {MovieSchema, Movie, MovieTC, MovieQuery, MovieMutation}