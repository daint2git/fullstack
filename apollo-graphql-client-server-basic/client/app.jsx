import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useLazyQuery,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      login
      avatar_url
    }
  }
`;

function Users() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;

  return data.users.map(user => (
    <div className="Card" key={user.id} style={{ border: '1px solid gray' }}>
      <div style={{ display: 'flex' }}>
        <img
          alt="avatar"
          className="Card--avatar"
          width={50}
          height={50}
          src={user.avatar_url}
        />
        <h4 className="Card--name">{user.login}</h4>
      </div>
      <a href={`https://github.com/${user.login}`} className="Card--link">
        See profile
      </a>
    </div>
  ));
}

function DelayedUsers() {
  const [getUsers, { loading, error, data }] = useLazyQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;

  return (
    <div>
      <button onClick={getUsers}>Get users</button>
      {data && data.users.map(user => (
        <div
          className="Card"
          key={user.id}
          style={{ border: '1px solid gray' }}
        >
          <div style={{ display: 'flex' }}>
            <img
              alt="avatar"
              className="Card--avatar"
              width={50}
              height={50}
              src={user.avatar_url}
            />
            <h4 className="Card--name">{user.login}</h4>
          </div>
          <a href={`https://github.com/${user.login}`} className="Card--link">
            See profile
          </a>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [isOpenUserList, setIsOpenUserList] = React.useState(false)

  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My Apollo app 🚀</h2>
        <button onClick={() => setIsOpenUserList(!isOpenUserList)}>toggle user list</button>
        {isOpenUserList && <Users />}
      </div>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
