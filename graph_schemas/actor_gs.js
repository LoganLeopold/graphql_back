const { Actor, ActorTC } = require('../models/actor')

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

module.exports = { ActorQuery, ActorMutation };