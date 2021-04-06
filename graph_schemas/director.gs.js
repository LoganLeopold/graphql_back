const { Director, DirectorTC } = require('../models/director')

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

module.exports = { DirectorQuery, DirectorMutation };