const { gql } = require('apollo-server');

module.exports = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    createdAt: String!
  }

  input AddBookInput {
    title: String!
    author: String!
  }

  input UpdateBookInput {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(input: AddBookInput): Book
    deleteBook(id: ID!): Boolean
    updateBook(input: UpdateBookInput): Boolean
  }
`;
