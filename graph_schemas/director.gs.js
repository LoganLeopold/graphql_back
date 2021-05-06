const { Director, DirectorTC } = require('../models/director')
const { MovieTC } = require('../models/movie')

const DirectorQuery = {
    directorById: DirectorTC.getResolver('findById'),
    directorByIds: DirectorTC.getResolver('findByIds'),
    directorOne: DirectorTC.getResolver('findOne'),
    directorMany: DirectorTC.getResolver('findMany'),
    directorCount: DirectorTC.getResolver('count'),
    directorConnection: DirectorTC.getResolver('connection'),
    directorPagination: DirectorTC.getResolver('pagination'),
};

const DirectorMutation = {
    directorCreateOne: DirectorTC.getResolver('createOne'),
    directorCreateMany: DirectorTC.getResolver('createMany'),
    directorUpdateById: DirectorTC.getResolver('updateById'),
    directorUpdateOne: DirectorTC.getResolver('updateOne'),
    directorUpdateMany: DirectorTC.getResolver('updateMany'),
    directorRemoveById: DirectorTC.getResolver('removeById'),
    directorRemoveOne: DirectorTC.getResolver('removeOne'),
    directorRemoveMany: DirectorTC.getResolver('removeMany'),
};

DirectorTC.addRelation(
    'Movies',
    {
        resolver: MovieTC.getResolver('findByIds'),
        prepareArgs: {
            _ids: (source) => source.Movies.map( movie => movie ),
            skip: null,
            sort: null
        },
        projection: { Movies: true }
    }
)

module.exports = { DirectorQuery, DirectorMutation };