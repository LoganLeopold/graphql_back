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

let byIds = schemaComposer.createResolver({
    name: 'modelIndependent',
    type: "String!",
    args: {
        modelId: "String!",
        updateId: "String!",
    },
    resolve: async ({source, args, context, info}) => {
        console.log(args)
        return "hello world"
    }
})

schemaComposer.Mutation.addFields({
    modelIndependent: byIds
})
        
/*
This resolver ultimately needs to:
-Take ids from source
-Use ids to go to db and update applicable subfields
*/
// const auditFields = schemaComposer.createResolver({
//     name: 'auditFields',
//     type: ,
// })

let schemaComposed = schemaComposer.buildSchema()
module.exports = { schemaComposed, schemaComposer };