export interface AddTodoParameters {
  title: string;
}
export interface Todo {
  userId: string;
  title: string;
  isCompleted: boolean;
  docId: string;
}

export interface MarkAsCompletedParameters {
  docId: string;
}
export type TodosFieldName = "addTodo" | "todos" | "markAsCompleted";
export interface CustomEvent {
  id: string;
  detail: {
    userName: string;

    fieldName: string;
    arguments: any;
  };
}
