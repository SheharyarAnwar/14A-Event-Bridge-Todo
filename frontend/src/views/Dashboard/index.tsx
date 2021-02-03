import React, { useContext, useEffect, useState } from "react"
import Header from "../../Components/Header"
import { RouteComponentProps } from "@reach/router"
import classes from "./index.module.css"
import { GlobalContext } from "../.."
import Tasklist, { Task } from "../../Components/TaskList/index"
import { useMutation, useQuery } from "@apollo/client"
import { ADD_TODO, GET_TODOS } from "../../Apollo/queries"
import { MARK_AS_COMPLETED } from "./../../Apollo/queries"
import { API } from "aws-amplify"
interface DasboardProps extends RouteComponentProps {}
const Index: React.FC<DasboardProps> = () => {
  const context = useContext(GlobalContext)
  const [data, setData] = useState<Task[]>([])
  // console.log(context && context.user)
  const [
    markComplete,
    { data: markData, error: markError, loading: markLoading },
  ] = useMutation(MARK_AS_COMPLETED)
  const [
    addTodo,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation(ADD_TODO)
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(GET_TODOS)
  useEffect(() => {
    queryData && setData(queryData.todos)
  }, [queryData])
  useEffect(() => {
    mutationData && setData(prev => [mutationData.addTodo, ...prev])
  }, [mutationData])
  useEffect(() => {
    markData &&
      setData(prev => {
        return prev.map(val => {
          if (val.docId === markData.markAsCompleted.docId) {
            return markData.markAsCompleted
          } else {
            return val
          }
        })
      })
  }, [markData])
  const onTaskAdded = (title: string) => {
    if (title.length <= 0) return
    addTodo({ variables: { title } })
  }
  const onComplete = (docId: string) => {
    console.log(docId)
    markComplete({ variables: { docId } })
  }
  console.log(queryError, mutationError, markError)
  return (
    <>
      <Header text="Logout" />
      <div className={classes.content}>
        <p className={classes.welcome}>Welcome</p>
        {/* <p className={classes.name}>{context.user?.user_metadata.full_name}</p> */}
        {queryLoading || mutationLoading || markLoading ? (
          <p style={{ marginTop: "20vh" }}>Loading . . . </p>
        ) : (
          <Tasklist
            data={data ? data : []}
            onTaskAddedHandler={onTaskAdded}
            onTaskCompleteHandler={onComplete}
          />
        )}
      </div>
    </>
  )
}

export default Index
