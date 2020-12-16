# apollo-graphql-crud

## graphql

- get books

```graphql
query {
  books {
    id
    title
    author
    createdAt
  }
}
```

- add book

```graphql
mutation {
  addBook(input: { title: "Title 1", author: "Dai" }) {
    id
    title
    author
    createdAt
  }
}
```

- update book

```graphql
mutation {
  updateBook(input: { id: 1, title: "Title 1", author: "Dai" })
}
```

- delete book

```graphql
mutation {
  deleteBook(id: 1)
}
```
