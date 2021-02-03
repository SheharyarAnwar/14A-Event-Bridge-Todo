import React from "react"
import { Task } from "../TaskList"
import classes from "./index.module.css"

const Index: React.FC<Task> = ({
  title,
  docId,
  isCompleted,
  userId,
  onCompleted,
}) => {
  const beforeRef = React.createRef<HTMLSpanElement>()
  const afterRef = React.createRef<HTMLSpanElement>()

  const onCheckClicked = () => {
    const iterableElements = Array.from([beforeRef.current, afterRef.current])
    const anim = iterableElements.forEach((el, i) => {
      el.animate([{ width: "100%", height: "100%" }], {
        duration: 200,
        pseudoElement: "::after",
        delay: i * 200,
        fill: "forwards",
      }).onfinish = () => i !== 0 && onCompleted(docId)
    })
  }
  return (
    <div className={classes.root}>
      <p>{title}</p>
      {isCompleted ? null : (
        <div onClick={onCheckClicked} className={classes.check}>
          <span className={classes.before} ref={beforeRef} />
          <span className={classes.after} ref={afterRef} />
        </div>
      )}
    </div>
  )
}

export default Index
