require('dotenv').config();
const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql');
const { ApolloServer } = require('apollo-server-express');
const { schemaComposed } = require('./graph_schemas/index_gs');

const app = express()

app.use(cors())
app.use(express.json())
app.use(require('./routes/routes'))

app.use('/graphql', graphqlHTTP({
    schema: schemaComposed,
    graphiql: true,
}));

app.get('/', (req,res) => {
    res.send("Hello world!")
})

app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), () => console.log(`locked and loaded on ${app.get('port')}`))

const apollo = new ApolloServer({
  schema: schemaComposed
});