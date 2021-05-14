const { NonNullComposer } = require('graphql-compose');
const { actors, ActorTC } = require('../models/actor')
const { movies, MovieTC } = require('../models/movie')

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
ActorMutation['actorUpdateByIdCascade'] = ActorTC.getResolver('updateById').wrap( newResolver => {

    newResolver.addArgs( {modelId: "String!"} )
    newResolver.removeArg('record')
    newResolver.type = ActorTC
    newResolver.name = 'actorUpdateByIdCascade'

    newResolver.resolve = async ({args}) => {

        try {

            let { nested, top } = args 
    
            let newActor = await actors.findByIdAndUpdate(
                modelId, //Id
                {$pull: { Movies: nested } },  //update
                {overwrite: false, new: true} //options
            )
    
            let newMovie = await movies.findByIdAndUpdate(
                nested, //Id
                {$pull: { Actors: top } },  //update
                {overwrite: false, new: true} //options
            )

            console.log(newMovie)
    
            return newActor._id

        } catch (err) {
            console.log(err)
            return err
        }
    }

}) 


module.exports = { ActorQuery, ActorMutation };