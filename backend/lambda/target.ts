import { ContextProvider } from "@aws-cdk/core";
import { Context, AppSyncResolverEvent } from "aws-lambda";
import { CustomEvent, TodosFieldName } from "../Interfaces";
import Todos from "./Services/Todo";
export async function handler(
  event: CustomEvent,
  context: Context
): Promise<any> {
  const todo = new Todos(process.env.TABLE || "");
  const decodedBases64Arguments = Buffer.from(
    event.detail.arguments,
    "base64"
  ).toString("utf8");
  console.log(event, context, "Salvation", decodedBases64Arguments);
  // console.log(decodedBases64Arguments, "Decoded");
  const fieldName: TodosFieldName = event.detail.fieldName as TodosFieldName;
  switch (fieldName) {
    case "addTodo":
      const addTodoResults = await todo.addTodos(event, context);
      return addTodoResults.Attributes;
    case "todos":
      const getAllTodosResults = await todo.getAllTodos(event, context);
      return getAllTodosResults.Items;
    case "markAsCompleted":
      const markAsCompletedResults = await todo.markTodoAsCompleted(
        event,
        context
      );
      console.log(markAsCompletedResults);
      return markAsCompletedResults.Attributes;

    default:
      throw new Error("Something went wrong with supplied method");
  }
}
