const { port,graphql } = require("./config");
const express = require('express');
const app = express();
const myroutes = require('./project1routes');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const { resolvers } = require("./resolvers");
const { schema } = require("./schema");
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    console.log('Time:', new Date() + 3600000 * -5.0); // GMT-->EST
    next();
});

app.use(
    graphql,
    graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: true
    })
);

// app.use('/', myroutes);

app.listen(port, () => {
console.log(`listening on port ${port}`);
});