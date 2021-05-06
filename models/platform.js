const compose = require('graphql-compose-mongoose')
const mongoose = require('../db')
const Schema = mongoose.Schema
// const { MovieQuery } = require('./movie')
// const { movieByIds } = MovieQuery

const PlatformSchema = new Schema({

    Name: String,
    Movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]

})

const Platform = mongoose.model('Platform', PlatformSchema)
const PlatformTC = compose.composeWithMongoose(Platform)

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
    platformCreateOne: PlatformTC.getResolver('createOne'),
    platformCreateMany: PlatformTC.getResolver('createMany'),
    platformUpdateById: PlatformTC.getResolver('updateById'),
    platformUpdateOne: PlatformTC.getResolver('updateOne'),
    platformUpdateMany: PlatformTC.getResolver('updateMany'),
    platformRemoveById: PlatformTC.getResolver('removeById'),
    platformRemoveOne: PlatformTC.getResolver('removeOne'),
    platformRemoveMany: PlatformTC.getResolver('removeMany'),
};

// PlatformTC.addRelation(
//     'Movies',
//     {
//         resolver: movieByIds,
//         prepareArgs: {
//             _ids: (source) => source.Movies.map( movie => movie ),
//             skip: null,
//             sort: null
//         },
//         projection: { Movies: true }   
//     }
// )

module.exports = {PlatformSchema, Platform, PlatformTC, PlatformQuery, PlatformMutation}