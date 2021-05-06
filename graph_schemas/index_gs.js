const SchemaComposer = require('graphql-compose').SchemaComposer

const db = require("../db")

const schemaComposer = new SchemaComposer();

const { ActorQuery, ActorMutation } = require('../models/actor');
const { DirectorQuery, DirectorMutation } = require('../models/director');
const { MovieQuery, MovieMutation } = require('../models/movie');
const { PlatformQuery, PlatformMutation } = require('../models/platform');

schemaComposer.Query.addFields({
    ...ActorQuery,
    ...DirectorQuery,
    ...MovieQuery,
    ...PlatformQuery,
});

schemaComposer.Mutation.addFields({
    ...ActorMutation,
    ...DirectorMutation,
    ...MovieMutation,
    ...PlatformMutation,
});

module.exports = schemaComposer.buildSchema();