// import { ApolloServer, gql } from 'apollo-server';
const { ApolloServer, gql } = require('apollo-server');

const bookSchema = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    createdAt: String!
  }

  type Query {
    books: [Book]
  }
`;

const bookResolver = {
  Query: {
    books() {
      return [
        {
          id: 1,
          title: 'The Awakening',
          author: 'Kate Chopin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: 'City of Glass',
          author: 'Paul Auster',
          createdAt: new Date().toISOString(),
        },
      ];
    },
  },
};

const server = new ApolloServer({
  typeDefs: [bookSchema],
  resolvers: [bookResolver],
});

server.listen().then(({ url }) => console.log(`Server ready at ${url}`));
