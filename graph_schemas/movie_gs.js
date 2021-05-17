const { movies, MovieTC } = require('../models/movie')
const { ActorTC } = require('../models/actor')
const { DirectorTC } = require('../models/director')
const { PlatformTC } = require('../models/platform')

MovieTC.addResolver({
    name: 'simpleMoviesDeleteHandle',
    args: { 
        field: 'String!',
        value: 'String!',
        movieId: 'MongoID!', 
    },
    description: "Take a field and update it's value based on the Mongoose schematype on the document indicated by the movieId.",
    type: MovieTC,
    resolve: async ({ source, args }) => {

        const { field, value, movieId } = args

        let movieReturn = await movies.findById(movieId)

        return movieReturn

    },
})

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
    simpleMoviesDeleteHandle: MovieTC.getResolver('simpleMoviesDeleteHandle'),
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
    'directors',
    {
        resolver: DirectorTC.getResolver('findByIds'),
        prepareArgs: {
            _ids: (source) => source.directors.map( dir => dir ) ,
            skip: null,
            sort: null
        },
        projection: { directors: true }
    }
)
MovieTC.addRelation(
    'actors',
    {
        resolver: ActorTC.getResolver('findByIds'),
        prepareArgs: {
            _ids: (source) => source.actors.map( actor => actor ),
            skip: null,
            sort: null
        },
        projection: { actors: true }
    }
)
MovieTC.addRelation(
    'platforms',
    {
        resolver: PlatformTC.getResolver('findByIds'),
        prepareArgs: {
            _ids: (source) => source.platforms.map( platform => platform),
            skip: null,
            sort: null,
        },
        projection: { platforms: true }
    }
)

module.exports = { MovieQuery, MovieMutation };