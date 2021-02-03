import React, { useEffect, useState } from "react"
import Task from "../Task"
import classes from "./index.module.css"
import Add from "../../Assets/Add.svg"

declare global {
  interface KeyframeAnimationOptions {
    pseudoElement?: string
  }
}
export interface Task {
  userId: string
  docId: string
  title: string
  isCompleted: boolean
  onCompleted?: (docId: string) => void
}
export interface TaskListProps {
  data: Task[]
  onTaskAddedHandler: (title: string) => void
  onTaskCompleteHandler: (docId: string) => void
}
const Index: React.FC<TaskListProps> = ({
  data,
  onTaskAddedHandler,
  onTaskCompleteHandler,
}) => {
  const underlineRef = React.createRef<HTMLDivElement>()
  const wrapperRef = React.createRef<HTMLDivElement>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [areCompleted, setAreCompleted] = useState<boolean>(false)
  const onCompleted = (docId: string) => {
    onTaskCompleteHandler(docId)
  }
  const tasks = data
    .filter(val => {
      return val.isCompleted === areCompleted
    })
    .map(val => <Task key={val.docId} {...val} onCompleted={onCompleted} />)
  const runUnderlineAnimation = (translation: number) => {
    underlineRef.current.animate(
      [{ transform: `translateX(${translation}%)` }],
      {
        easing: "cubic-bezier( 1, 0.01, 1, 0.95 )",
        pseudoElement: "::after",
        duration: 200,
        fill: "forwards",
      }
    )
  }
  const onInProgressClicked = () => {
    runUnderlineAnimation(0)
    setAreCompleted(false)
  }
  const onCompletedClicked = () => {
    runUnderlineAnimation(100)
    setAreCompleted(true)
  }

  return (
    <>
      <div className={classes.root}>
        <div className={classes.controls} ref={underlineRef}>
          <h4 onClick={onInProgressClicked}>In Progress</h4>
          <h4 onClick={onCompletedClicked}>Completed</h4>
        </div>
        <div className={classes.tasks}>
          {tasks && tasks.length <= 0 ? (
            <p style={{ marginTop: "10%", textAlign: "center" }}>
              No Tasks To Show
            </p>
          ) : (
            tasks
          )}
        </div>
        <div className={classes.add} onClick={() => setModalOpen(true)}>
          <Add width={15} />
        </div>
      </div>
      <div
        style={{ display: modalOpen ? "flex" : "none" }}
        className={classes.modalWrapper}
        ref={wrapperRef}
        onClick={e => {
          wrapperRef.current === (e.target as Node) && setModalOpen(false)
        }}
      >
        <div className={classes.modal}>
          <h4>Tilte</h4>
          <input
            placeholder="Click To Add Text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
          ></input>
          <button
            className={classes.add}
            onClick={() => onTaskAddedHandler(title)}
          >
            <Add width={15} />
          </button>
        </div>
      </div>
    </>
  )
}

export default Index
