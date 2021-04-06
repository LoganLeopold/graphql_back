const { Movie, MovieTC } = require('../models/movie')

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

module.exports = { MovieQuery, MovieMutation };