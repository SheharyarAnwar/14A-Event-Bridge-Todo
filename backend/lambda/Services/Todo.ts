import { AppSyncResolverEvent, Context } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import {
  AddTodoParameters,
  CustomEvent,
  MarkAsCompletedParameters,
  Todo,
} from "../../Interfaces";
// import { v4 } from "uuid";
class Todos {
  documentClient: DynamoDB.DocumentClient;
  tableName: string;
  constructor(tableName: string) {
    this.documentClient = new DynamoDB.DocumentClient();
    this.tableName = tableName;
  }
  async addTodos(event: CustomEvent, context: Context) {
    const decodedBases64Arguments = JSON.parse(
      Buffer.from(event.detail.arguments, "base64").toString("utf8")
    );
    console.log(decodedBases64Arguments, "Parsed String");

    const res = await this.documentClient
      .update({
        TableName: this.tableName,
        Key: { docId: context.awsRequestId },
        UpdateExpression:
          "SET userId = :userId, isCompleted = :isCompleted, title = :title",
        ExpressionAttributeValues: {
          ":userId": event?.detail.userName,
          ":isCompleted": false,
          // @ts-ignore
          ":title": decodedBases64Arguments.title,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return res;
  }
  async getAllTodos(event: CustomEvent, context: Context) {
    console.log(event.detail.userName, "Now OKi get all");
    const res = await this.documentClient
      .scan({
        TableName: this.tableName,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": event.detail.userName },
      })
      .promise();
    //replace hard coded userId with context Id later
    return res;
  }
  async markTodoAsCompleted(event: CustomEvent, context: Context) {
    const res = await this.documentClient
      .update({
        TableName: this.tableName,
        Key: { docId: event.id },
        UpdateExpression: "SET isCompleted = :isCompleted",
        ExpressionAttributeValues: {
          ":isCompleted": true,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
    return res;
  }
}

export default Todos;
