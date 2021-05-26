const { directors, DirectorTC } = require('../models/director')
const { MovieTC } = require('../models/movie')

DirectorTC.addResolver({
    name: 'nestedDirectorsDeleteHandle',
    args: { 
        directorId: 'MongoID!',
        docId: 'MongoID!', 
        docModel: 'String!',
    },
    description: "Give this a director id, document id, and document model name. It will remove the actor from the doc and remove the doc id from the appropriate model field on the actor document.",
    type: DirectorTC,
    resolve: async ({ source, args }) => {

        const { directorId, docId, docModel } = args

        console.log(args)

        let newDoc = await Mongoose.model(`${docModel}`).findByIdAndUpdate(
            docId, 
            {$pull: { directors: directorId }},
            {overwrite: false, new: true}
        )

        let newDirector = await directors.findByIdAndUpdate(
            directorId,
            {$pull: { [docModel]: directorId } },
            {overwrite: false, new: true}
        )

        return newDoc
    },
})

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
    nestedDirectorsDeleteHandle: DirectorTC.getResolver('nestedDirectorsDeleteHandle'),
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
    'movies',
    {
        resolver: MovieTC.getResolver('findByIds'),
        prepareArgs: {
            _ids: (source) => source.movies.map( movie => movie ),
            skip: null,
            sort: null
        },
        projection: { movies: true }
    }
)

module.exports = { DirectorQuery, DirectorMutation };