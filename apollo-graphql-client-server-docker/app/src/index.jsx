import React from 'react';
import ReactDOM from 'react-dom';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost/api',
  cache: new InMemoryCache(),
});

console.log(process.env.NODE_ENV);

console.log(process.env.APP_URL);

console.log(process.env.NODE_VERSION);

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

function BookList() {
  const { loading, error, data } = useQuery(GET_BOOKS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;

  return (
    <div>
      {data.books.map(book => (
        <div key={book.id} style={{ borderBottom: '1px solid gray' }}>
          <h3>{book.title}</h3>
          <p>author {book.author}</p>
          <span>{book.createdAt}</span>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
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
