const { Movie, MovieTC } = require('../models/movie')
const { ActorTC } = require('../models/actor')
const { DirectorTC } = require('../models/director')
const { PlatformTC } = require('../models/platform')

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
        resolver: DirectorTC.getResolver('findById'),
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
        resolver: ActorTC.getResolver('findByIds'),
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
        resolver: PlatformTC.getResolver('findByIds'),
        prepareArgs: {
            _ids: (source) => source.Platforms.map( platform => platform),
            skip: null,
            sort: null,
        },
        projection: { Platforms: true }
    }
)

module.exports = { MovieQuery, MovieMutation };