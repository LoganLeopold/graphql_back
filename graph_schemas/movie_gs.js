const { movies, MovieTC } = require('../models/movie')
const { ActorTC } = require('../models/actor')
const { DirectorTC } = require('../models/director')
const { PlatformTC } = require('../models/platform')
const Mongoose = require('mongoose')

/* For NewRecords.js on the front to handle adding to document field arrays */
MovieTC.addResolver({
    name: 'moviesAddRecHandle',
    args: { 
        newRecName: 'String!',
        newRecModel: 'String!',
        movieId: 'MongoID!', 
    },
    description: "Use new rec name to findoneandupdate or upsert a new document for newRecModel on the movie with movieId. Return the new MovieTC",
    type: MovieTC,
    resolve: async ({ source, args }) => {

        const { newRecName, newRecModel, movieId } = args

        try {

            // Object.keys(Mongoose.models).includes(newRecModel)
            if (Object.keys(Mongoose.models).includes(newRecModel)) {           

                let newRec = await Mongoose.model(newRecModel).findOneAndUpdate( 
                    {name: newRecName.trim()}, 
                    {
                        $push: {movies: movieId},
                        $setOnInsert: {
                            name: newRecName.trim(),
                        }
                    },
                    {upsert: true, new: true, setDefaultsOnInsert: true}
                )

                let updatedMovie = await movies.findByIdAndUpdate(
                    movieId,
                    {$push: {[newRecModel]: newRec._id}},  
                )
                
                return updatedMovie
            
            } else {

                let updatedMovie = await movies.findByIdAndUpdate(
                    movieId,
                    {$push: {[newRecModel]: newRecName}},  
                )
                
                return updatedMovie

            }

        } catch (err) {
            console.log(err)
        }
        

    },
})

/* For deleting referene document records */
MovieTC.addResolver({
    name: 'moviesDeleteRelatedRecHandle',
    args: { 
        recId: 'MongoID!',
        recModel: 'String!',
        movieId: 'MongoID!', 
    },
    description: "Use new recId to findoneandupdate the record by pulling the movieId out of its movies array, and pull the recId out of reference array in the movie with movieId the same way.",
    type: MovieTC,
    resolve: async ({ source, args }) => {

        const { recId, recModel, movieId } = args //Incoming is recordId to be altered/removed from movie, model name of record, and Id of movie being altered.

        console.log( recId, recModel, movieId, "ARGS" )

        try {

            let newRec = await Mongoose.model(recModel).findByIdAndUpdate( 
                recId, 
                {$pull: {movies: movieId }},
                {new: true}
            )

            console.log(newRec, "NEWREC")

            let updatedMovie = await movies.findByIdAndUpdate(
                movieId,
                {$pull: {[recModel]: recId}},  
            )
            
            return updatedMovie

        } catch (err) {
            console.log(err)
        }
        

    },
})

/* Realized this won't handle simple record arrays (that aren't documents) appropriately */
/* This is for fields that just have key value pairs because simple, non-related-doc fields are the only ones which will be edited on the smae page. */
MovieTC.addResolver({
    name: 'simpleMoviesUpdateHandle',
    args: { 
        field: 'String!',
        deleteValue: 'String!',
        newValue: 'String',
        movieId: 'MongoID!', 
    },
    description: "Take a field (from the SimpleRecord.js subDoc pro) and update it's value based on the Mongoose schematype on the document indicated by the movieId.",
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

        const { field, deleteValue, newValue, movieId } = args

        let update;

        if (movies.schema.paths[`${field}`].instance == "Array") {
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
        } else if (movies.schema.paths[`${field}`].instance == "Number" || "String") {          
            update = {[field]: newValue}
        } else {
            console.log('untended')
        }

        try {
            let newMovie = await movies.findByIdAndUpdate( movieId, update, {overwrite: false, new: true} )
            console.log(newMovie)
            return newMovie
        } catch (err) {
            console.log(err)
        }

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
    simpleMoviesUpdateHandle: MovieTC.getResolver('simpleMoviesUpdateHandle'),
    moviesAddRecHandle: MovieTC.getResolver('moviesAddRecHandle'),
    moviesDeleteRelatedRecHandle: MovieTC.getResolver('moviesDeleteRelatedRecHandle'),
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