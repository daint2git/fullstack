import React, { useRef, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from '@apollo/client';
import './app.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
      createdAt
    }
  }
`;

const ADD_BOOK = gql`
  mutation($input: AddBookInput!) {
    addBook(input: $input) {
      id
      title
      author
      createdAt
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation($input: UpdateBookInput!) {
    updateBook(input: $input)
  }
`;

const DELETE_BOOK = gql`
  mutation($id: ID!) {
    deleteBook(id: $id)
  }
`;

function AddBookForm() {
  const titleRef = useRef('');
  const authorRef = useRef('');

  const resetInput = () => {
    titleRef.current.value = '';
    authorRef.current.value = '';
  };

  const [addBook] = useMutation(ADD_BOOK, {
    update(cache, { data }) {
      // Fetch the books from the cache
      const existingBooks = cache.readQuery({ query: GET_BOOKS });

      // Add the new book to the cache
      const newBook = data.addBook;

      cache.writeQuery({
        query: GET_BOOKS,
        data: { books: [newBook, ...existingBooks.books] },
      });
    },
    onCompleted: resetInput,
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        addBook({
          variables: {
            input: {
              title: titleRef.current.value,
              author: authorRef.current.value,
            },
          },
        });
      }}
    >
      <h3>Add book form</h3>
      <div>
        <label htmlFor="title">title</label>
        <input id="title" type="text" ref={titleRef} />
      </div>
      <div>
        <label htmlFor="author">author</label>
        <input id="author" type="text" ref={authorRef} />
      </div>
      <button type="submit">Add book</button>
    </form>
  );
}

function UpdateBookModal({ book, onClose }) {
  const modalRef = useRef();
  const titleRef = useRef();
  const authorRef = useRef();

  const [updateBook] = useMutation(UPDATE_BOOK, {
    update(cache) {
      const existingBooks = cache.readQuery({ query: GET_BOOKS });
      const newBooks = existingBooks.books.map(existingBook =>
        existingBook.id === book.id
          ? {
              ...existingBook,
              title: titleRef.current.value,
              author: authorRef.current.value,
            }
          : existingBook,
      );

      cache.writeQuery({
        query: GET_BOOKS,
        data: { books: newBooks },
      });
    },
    onCompleted: onClose,
  });

  useLayoutEffect(() => {
    const listener = () => {
      if (!modalRef.current || modalRef.current.contains(event.target)) {
        return;
      }

      onClose();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  });

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form
          onSubmit={e => {
            e.preventDefault();

            updateBook({
              variables: {
                input: {
                  id: book.id,
                  title: titleRef.current.value,
                  author: authorRef.current.value,
                },
              },
            });
          }}
        >
          <h3>Update book</h3>
          <div>
            <label htmlFor="title">title</label>
            <input
              id="title"
              type="text"
              ref={titleRef}
              defaultValue={book.title}
            />
          </div>
          <div>
            <label htmlFor="author">author</label>
            <input
              id="author"
              type="text"
              ref={authorRef}
              defaultValue={book.author}
            />
          </div>
          <button type="submit">Update book</button>
        </form>
      </div>
    </div>
  );
}

function BookItem({ book }) {
  const [openModal, setOpenModal] = useState(false);

  const [deleteBook] = useMutation(DELETE_BOOK, {
    update(cache) {
      const existingBooks = cache.readQuery({ query: GET_BOOKS });
      const newBooks = existingBooks.books.filter(
        existingBook => existingBook.id !== book.id,
      );

      cache.writeQuery({
        query: GET_BOOKS,
        data: { books: newBooks },
      });
    },
  });

  return (
    <>
      <div
        style={{ borderBottom: '1px solid gray' }}
        onClick={() => setOpenModal(true)}
      >
        <h3>
          {book.title}{' '}
          <button
            className="delete-button"
            onClick={e => {
              e.stopPropagation();

              if (
                window.confirm(`You want delete book with id is ${book.id}`)
              ) {
                deleteBook({ variables: { id: book.id } });
              }
            }}
          >
            &times;
          </button>
        </h3>
        <p>author {book.author}</p>
        <span>{book.createdAt}</span>
      </div>
      {openModal && (
        <UpdateBookModal book={book} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
}

function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;

  return (
    <div>
      {data.books.map(book => (
        <BookItem key={book.id} book={book} />
      ))}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <AddBookForm />
      <br />
      <BookList />
    </ApolloProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
);
