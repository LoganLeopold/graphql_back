const { platforms, PlatformTC } = require('../models/platform')
const { MovieTC } = require('../models/movie')

PlatformTC.addResolver({
    name: 'nestedPlatformsDeleteHandle',
    args: { 
        platformId: 'MongoID!',
        docId: 'MongoID!', 
        docModel: 'String!',
    },
    description: "Give this a director id, document id, and document model name. It will remove the actor from the doc and remove the doc id from the appropriate model field on the actor document.",
    type: PlatformTC,
    resolve: async ({ source, args }) => {

        const { platformId, docId, docModel } = args

        console.log(args)

        let newDoc = await Mongoose.model(`${docModel}`).findByIdAndUpdate(
            docId, 
            {$pull: { platforms: platformId }},
            {overwrite: false, new: true}
        )

        let newPlatform = await platforms.findByIdAndUpdate(
            platformId,
            {$pull: { [docModel]: platformId } },
            {overwrite: false, new: true}
        )

        return newDoc
    },
})

const PlatformQuery = {
    platformById: PlatformTC.getResolver('findById'),
    platformByIds: PlatformTC.getResolver('findByIds'),
    platformOne: PlatformTC.getResolver('findOne'),
    platformMany: PlatformTC.getResolver('findMany'),
    platformCount: PlatformTC.getResolver('count'),
    platformConnection: PlatformTC.getResolver('connection'),
    platformPagination: PlatformTC.getResolver('pagination'),
};

const PlatformMutation = {
    nestedPlatformsDeleteHandle: PlatformTC.getResolver('nestedPlatformsDeleteHandle'),
    platformCreateOne: PlatformTC.getResolver('createOne'),
    platformCreateMany: PlatformTC.getResolver('createMany'),
    platformUpdateById: PlatformTC.getResolver('updateById'),
    platformUpdateOne: PlatformTC.getResolver('updateOne'),
    platformUpdateMany: PlatformTC.getResolver('updateMany'),
    platformRemoveById: PlatformTC.getResolver('removeById'),
    platformRemoveOne: PlatformTC.getResolver('removeOne'),
    platformRemoveMany: PlatformTC.getResolver('removeMany'),
};

PlatformTC.addRelation(
    'Movies',
    {
        resolver: MovieTC.getResolver('findByIds'),
        prepareArgs: {
            _ids: (source) => source.movies.map( movie => movie ),
            skip: null,
            sort: null
        },
        projection: { Movies: true }   
    }
)

module.exports = { PlatformQuery, PlatformMutation };