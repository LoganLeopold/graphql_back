const Mongoose = require('mongoose')
const { NonNullComposer } = require('graphql-compose');
const { actors, ActorTC } = require('../models/actor')
const { movies, MovieTC } = require('../models/movie')

ActorTC.addResolver({
    name: 'nestedActorsDeleteHandle',
    args: { 
        actorId: 'MongoID!',
        docId: 'MongoID!', 
        docModel: 'String!',
    },
    description: "Give this an actor id, document id, and document model name. It will remove the actor from the doc and remove the doc id from the appropriate model field on the actor document.",
    type: ActorTC,
    resolve: async ({ source, args }) => {

        const { actorId, docId, docModel } = args

        console.log(args)

        let newDoc = await Mongoose.model(`${docModel}`).findByIdAndUpdate(
            docId, 
            {$pull: { actors: actorId }},
            {overwrite: false, new: true}
        )

        let newActor = await actors.findByIdAndUpdate(
            actorId,
            {$pull: { [docModel]: actorId } },
            {overwrite: false, new: true}
        )

        return newDoc
    },
})

ActorTC.addResolver({
    name: 'simpleActorsDeleteHandle',
    args: { 
        actorId: 'MongoID!',
        docId: 'MongoID!', 
        docModel: 'String!',
    },
    description: "Give this an actor id, document id, and document model name. It will remove the actor from the doc and remove the doc id from the appropriate model field on the actor document.",
    type: ActorTC,
    resolve: async ({ source, args }) => {

        const { actorId, docId, docModel } = args

        console.log(args)

        let newDoc = await Mongoose.model(`${docModel}`).findByIdAndUpdate(
            docId, 
            {$pull: { actors: actorId }},
            {overwrite: false, new: true}
        )

        let newActor = await actors.findByIdAndUpdate(
            actorId,
            {$pull: { [docModel]: actorId } },
            {overwrite: false, new: true}
        )

        return newDoc

    },
})

const ActorQuery = {
    actorById: ActorTC.getResolver('findById'),
    actorByIds: ActorTC.getResolver('findByIds'),
    actorOne: ActorTC.getResolver('findOne'),
    actorMany: ActorTC.getResolver('findMany'),
    actorCount: ActorTC.getResolver('count'),
    actorConnection: ActorTC.getResolver('connection'),
    actorPagination: ActorTC.getResolver('pagination'),
};

const ActorMutation = {
    nestedAuthorDeleteHandle: ActorTC.getResolver('nestedActorsDeleteHandle'),
    actorCreateOne: ActorTC.getResolver('createOne'),
    actorCreateMany: ActorTC.getResolver('createMany'),
    actorUpdateById: ActorTC.getResolver('updateById'),
    actorUpdateOne: ActorTC.getResolver('updateOne'),
    actorUpdateMany: ActorTC.getResolver('updateMany'),
    actorRemoveById: ActorTC.getResolver('removeById'),
    actorRemoveOne: ActorTC.getResolver('removeOne'),
    actorRemoveMany: ActorTC.getResolver('removeMany'),
};

ActorTC.addRelation(
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

// Good example of working resolver wrapper but want to try this logic in index_gs for model-independent synthesis
// ActorMutation['actorUpdateByIdCascade'] = ActorTC.getResolver('updateById').wrap( newResolver => {

//     newResolver.addArgs( {modelId: "String!"} )
//     newResolver.removeArg('record')
//     newResolver.type = ActorTC
//     newResolver.name = 'actorUpdateByIdCascade'

//     newResolver.resolve = async ({args}) => {

//         try {

//             let { nested, top } = args 
    
//             let newActor = await actors.findByIdAndUpdate(
//                 top, //Id
//                 {$pull: { movies: nested } },  //update
//                 {overwrite: false, new: true} //options
//             )
    
//             let newMovie = await movies.findByIdAndUpdate(
//                 nested, //Id
//                 {$pull: { actors: top } },  //update
//                 {overwrite: false, new: true} //options
//             )

//             console.log(newMovie)
    
//             return newActor._id

//         } catch (err) {
//             console.log(err)
//             return err
//         }
//     }

// }) 

// ActorMutation['nestedAuthorDeleteHandle'] = 

module.exports = { ActorQuery, ActorMutation };