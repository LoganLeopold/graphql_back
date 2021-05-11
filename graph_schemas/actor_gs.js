const { NonNullComposer } = require('graphql-compose');
const { Actor, ActorTC } = require('../models/actor')
const { Movie, MovieTC } = require('../models/movie')

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

/* Started from scratch, but going to try to resolve.wrap() or like below */
// ActorMutation['actorUpdateByIdCascade'] = ActorTC.addResolver({
//     name: 'actorUpdateByIdCascade',
//     args: {  }
// })

// Good example of working resolver wrapper but want to try this logic in index_gs for model-independent synthesis
ActorMutation['actorUpdateByIdCascade'] = ActorTC.getResolver('updateById').wrap( newResolver => {

    newResolver.addArgs( {modelId: "String!"} )
    newResolver.removeArg('record')
    newResolver.type = ActorTC
    newResolver.name = 'actorUpdateByIdCascade'

    newResolver.resolve = async ({args}) => {
        console.log(args)
        let { _id, modelId } = args 

        let newActor = await Actor.findByIdAndUpdate(
            {$pull: { Movies: _id } },  //update
            {overwrite: false, new: true} //options
        )

        let newMovie = await Movie.findByIdAndUpdate(
            {$pull: { Actors: modelId } },  //update
            {overwrite: false, new: true} //options
        )

        return newActor._id
    }

}) 


module.exports = { ActorQuery, ActorMutation };