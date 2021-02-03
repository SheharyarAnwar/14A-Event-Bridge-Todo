import { gql } from "@apollo/client"

export const GET_TODOS = gql`
  query {
    todos {
      isCompleted
      userId
      docId
      title
    }
  }
`

export const ADD_TODO = gql`
  mutation($title: String!) {
    addTodo(title: $title) {
      isCompleted
      userId
      docId
      title
    }
  }
`
export const MARK_AS_COMPLETED = gql`
  mutation($docId: ID!) {
    markAsCompleted(docId: $docId) {
      isCompleted
      userId
      docId
      title
    }
  }
`
