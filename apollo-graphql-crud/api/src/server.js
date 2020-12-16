const { ApolloServer, gql } = require('apollo-server');

const bookResolver = require('./graphql/resolvers/book');
const bookSchema = require('./graphql/schemas/book');

const server = new ApolloServer({
  typeDefs: [bookSchema],
  resolvers: [bookResolver],
});

server.listen().then(({ url }) => console.log(`Server ready at ${url}`));
