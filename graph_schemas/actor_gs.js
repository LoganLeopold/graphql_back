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


/* There wouldn't be an actors nested update since in the UI we're not updating on the same page, but navigating to that page to update the subdoc. */

// ActorTC.addResolver({
//     name: 'nestedActorsUpdateHandle',
//     args: { 
//         actorId: 'MongoID!',
//         docId: 'MongoID!', 
//         docModel: 'String!',
//     },
//     description: "",
//     type: ActorTC,
//     resolve: async ({ source, args }) => {

//         const { actorId, docId, docModel } = args

//         console.log(args)

//         let newDoc = await Mongoose.model(`${docModel}`).findByIdAndUpdate(
//             docId, 
//             {$pull: { actors: actorId }},
//             {overwrite: false, new: true}
//         )

//         let newActor = await actors.findByIdAndUpdate(
//             actorId,
//             {$pull: { [docModel]: actorId } },
//             {overwrite: false, new: true}
//         )

//         return newDoc

//     },
// })

/* This is for fields that just have key value pairs (not reference documents) because simple, non-related-doc fields are the only ones which will be edited on the smae page. */
ActorTC.addResolver({
    name: 'simpleActorsUpdateHandle',
    args: { 
        field: 'String!',
        deleteValue: 'String!',
        newValue: 'String',
        actorId: 'MongoID!', 
    },
    description: "Take a field (from the SimpleRecord.js subDoc prop) and update it's value based on the Mongoose schematype on the document indicated by the actorId.",
    type: MovieTC,
    resolve: async ({ source, args }) => {
        
        // There's real potential here for one resolver function to handle all the data types just seeing how this data comes in and how easy it is to change the update. 

        // The argument against is that so many non-null args to allow for all the options is not declarative and in support of the type system/expectations built into GraphQL. 

        // -> data comes in
        // -> if (args. firstArg or secondArg .modelName): use a nested $pull
        // -> if (args .firstArg or secondArg .field):
            // Use below logic ('${field}') to carry out the following conditional:
                // -> an array of normal scalars, do a pull
                // -> if it's simple normal scalar, do the middle else if below

        const { field, deleteValue, newValue, actorId } = args

        let update;

        if (actors.schema.paths[`${field}`].instance == "Array") {
            //Assuming all newValues are different than the current record because of submission handling:
                if (!newValue) { // -> if there is a deleteValue and no newValue we do a pull with no push 
                    update = {$pull: { [field]: deleteValue} }
                }
                else {// -> if there is a deleteValue and a newValue we do a pull ~and~ a push 
                    update = {
                        $pull: { [field]: deleteValue}, 
                        $push: { [field]: newValue }
                    }
                }
        } else if (actors.schema.paths[`${field}`].instance == "Number" || "String") {          
            update = {[field]: newValue}
        } else {
            console.log('untended')
        }

        try {
            let newActor = await actors.findByIdAndUpdate( actorId, update, {overwrite: false, new: true} )
            console.log(newActor)
            return newActor
        } catch (err) {
            console.log(err)
        }

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
    simpleActorsUpdateHandle: ActorTC.getResolver('simpleActorsUpdateHandle'),
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