let books = require('../../../../database');

module.exports = {
  Query: {
    books() {
      return books;
    },
  },
  Mutation: {
    addBook(parent, args, context, info) {
      const { title, author } = args.input;
      const newBook = {
        id: Date.now(),
        title,
        author,
        createdAt: new Date().toISOString(),
      };

      books.push(newBook);

      return newBook;
    },
    deleteBook(parent, args, context, info) {
      const index = books.findIndex(book => book.id === parseInt(args.id, 10));

      if (index !== -1) {
        books.splice(index, 1);
        return true;
      }

      return false;
    },
    updateBook(parent, args, context, info) {
      const { id, ...rest } = args.input;
      const index = books.findIndex(book => book.id === parseInt(id, 10));

      if (index !== -1) {
        books[index] = {
          ...books[index],
          ...rest,
        };
        return true;
      }

      return false;
    },
  },
};
