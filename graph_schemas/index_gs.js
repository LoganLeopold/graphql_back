const SchemaComposer = require('graphql-compose').SchemaComposer

const db = require("../db")

const schemaComposer = new SchemaComposer();

const { ActorQuery, ActorMutation } = require('./actor_gs');
const { DirectorQuery, DirectorMutation } = require('./director.gs');
const { MovieQuery, MovieMutation } = require('./movie_gs');
const { PlatformQuery, PlatformMutation } = require('./platform_gs');

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
        

let schemaComposed = schemaComposer.buildSchema()
module.exports = { schemaComposed, schemaComposer };