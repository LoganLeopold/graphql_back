const { Platform, PlatformTC } = require('../models/platform')

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

module.exports = { PlatformQuery, PlatformMutation };