const { Actor, ActorTC } = require('../models/actor')
const { MovieTC } = require('../models/movie')

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

ActorMutation['actorUpdateByIdCascade'] = ActorTC.getResolver('updateById').wrap( newResolver => {

    newResolver.name = 'actorUpdateByIdCascade'

    //
    newResolver.resolve = async ({args}) => console.log(args)

}) 

// const findManyReduced = AuthorTC.getResolver('findMany').wrap(newResolver => {
//     // for new created resolver, clone its `filter` argument with a new name
//     newResolver.cloneArg('filter', 'AuthorFilterForUsers');
//     // remove some filter fields to which regular users should not have access
//     newResolver.getArgTC('filter').removeFields(['age', 'other_sensetive_filter']);
//     // and return modified resolver with new set of args
//     return newResolver;
//   });

// console.log(ActorMutation.actorUpdateMany.args.filter.type._gqType)
// FilterUpdateManyActorInput
// console.log(ActorMutation.actorUpdateMany.args.filter.type._gqcFields)

module.exports = { ActorQuery, ActorMutation };