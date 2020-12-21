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
    getBookById(id: ID!): Book
  }

  type Mutation {
    addBook(input: AddBookInput!): Book
    updateBook(input: UpdateBookInput!): Boolean
    deleteBook(id: ID!): Boolean
  }
`;
