import cdk = require("@aws-cdk/core");
import {
  CfnGraphQLApi,
  CfnApiKey,
  CfnGraphQLSchema,
  CfnDataSource,
  CfnResolver,
} from "@aws-cdk/aws-appsync";
import { Role, ServicePrincipal, PolicyStatement } from "@aws-cdk/aws-iam";
// import { Rule } from "@aws-cdk/aws-events";
import * as lambda from "@aws-cdk/aws-lambda";
import * as targets from "@aws-cdk/aws-events-targets";
import * as cognito from "@aws-cdk/aws-cognito";
import * as events from "@aws-cdk/aws-events";
import * as appsync from "@aws-cdk/aws-appsync";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
export class TodoAppBridgeBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = cognito.UserPool.fromUserPoolArn(
      this,
      "BridgeTodoAppUserPool",
      "arn:aws:cognito-idp:ap-south-1:691388530610:userpool/ap-south-1_I7pIgOTKI"
    );
    const userPoolClient = cognito.UserPoolClient.fromUserPoolClientId(
      this,
      "BridgePoolClientTodoApp",
      "3bqj0cshib2ip6q5e9ei8fmrd1"
    );
    const targetHandler = new lambda.Function(
      this,
      "TodoBridgeTargetHandlerSheharyar",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: "target.handler",
        code: lambda.Code.fromAsset("lambda"),
      }
    );
    const graphEndPoint = new appsync.GraphqlApi(
      this,
      "TodoAppBridgeEndPointSherry",
      {
        name: "todo-app-sheharyar-bridge",
        schema: appsync.Schema.fromAsset("schema/index.gql"),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: userPool,
              defaultAction: appsync.UserPoolDefaultAction.ALLOW,
            },
          },
        },
        xrayEnabled: true,
      }
    );
    const table = dynamodb.Table.fromTableArn(
      this,
      "TodoAppBridgeTable",
      "arn:aws:dynamodb:ap-south-1:691388530610:table/todos"
    );
    table.grantFullAccess(targetHandler);
    targetHandler.addEnvironment("TABLE", table.tableName);
    const appsyncEventBridgeRole = new Role(this, "AppSyncEventBridgeRole", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
    });

    appsyncEventBridgeRole.addToPolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: ["events:Put*"],
      })
    );
    const dataSource = graphEndPoint.addHttpDataSource(
      "httpDataSource",
      "https://events." + this.region + ".amazonaws.com/",
      {
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: "events",
        },
      }
    );
    events.EventBus.grantPutEvents(dataSource);
    dataSource.createResolver({
      fieldName: "addTodo",
      typeName: "Mutation",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("response.vtl"),
    });
    dataSource.createResolver({
      fieldName: "markAsCompleted",
      typeName: "Mutation",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("response.vtl"),
    });
    dataSource.createResolver({
      fieldName: "todos",
      typeName: "Query",
      requestMappingTemplate: appsync.MappingTemplate.fromFile("request.vtl"),
      responseMappingTemplate: appsync.MappingTemplate.fromFile("response.vtl"),
    });
    const rule = new events.Rule(this, "AppSyncEventBridgeRule", {
      eventPattern: {
        source: ["appsync"],
      },
      targets: [new targets.LambdaFunction(targetHandler)],
    });
  }
}

// export class AppSyncCdkStack extends cdk.Stack {
//   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const appSync2EventBridgeGraphQLApi = new CfnGraphQLApi(
//       this,
//       "AppSync2EventBridgeApi",
//       {
//         name: "AppSync2EventBridge-API",
//         authenticationType: "API_KEY",
//       }
//     );

//     new CfnApiKey(this, "AppSync2EventBridgeApiKey", {
//       apiId: appSync2EventBridgeGraphQLApi.attrApiId,
//     });

//     const apiSchema = new CfnGraphQLSchema(this, "ItemsSchema", {
//       apiId: appSync2EventBridgeGraphQLApi.attrApiId,
//       definition: `type Event {
//         result: String
//       }

//       type Mutation {
//         putEvent(event: String!): Event
//       }

//       type Query {
//         getEvent: Event
//       }

//       schema {
//         query: Query
//         mutation: Mutation
//       }`,
//     });

//     const appsyncEventBridgeRole = new Role(this, "AppSyncEventBridgeRole", {
//       assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
//     });

//     appsyncEventBridgeRole.addToPolicy(
//       new PolicyStatement({
//         resources: ["*"],
//         actions: ["events:Put*"],
//       })
//     );

//     const dataSource = new CfnDataSource(this, "ItemsDataSource", {
//       apiId: appSync2EventBridgeGraphQLApi.attrApiId,
//       name: "EventBridgeDataSource",
//       type: "HTTP",
//       httpConfig: {
//         authorizationConfig: {
//           authorizationType: "AWS_IAM",
//           awsIamConfig: {
//             signingRegion: this.region,
//             signingServiceName: "events",
//           },
//         },
//         endpoint: "https://events." + this.region + ".amazonaws.com/",
//       },
//       serviceRoleArn: appsyncEventBridgeRole.roleArn,
//     });
//     const putEventResolver = new CfnResolver(this, "PutEventMutationResolver", {
//       apiId: appSync2EventBridgeGraphQLApi.attrApiId,
//       typeName: "Mutation",
//       fieldName: "putEvent",
//       dataSourceName: dataSource.name,
//       requestMappingTemplate: `{
//         "version": "2018-05-29",
//         "method": "POST",
//         "resourcePath": "/",
//         "params": {
//           "headers": {
//             "content-type": "application/x-amz-json-1.1",
//             "x-amz-target":"AWSEvents.PutEvents"
//           },
//           "body": {
//             "Entries":[
//               {
//                 "Source":"appsync",
//                 "EventBusName": "default",
//                 "Detail":"{ \\\"event\\\": \\\"$ctx.arguments.event\\\"}",
//                 "DetailType":"Event Bridge via GraphQL"
//                }
//             ]
//           }
//         }
//       }`,
//       responseMappingTemplate: `## Raise a GraphQL field error in case of a datasource invocation error
//       #if($ctx.error)
//         $util.error($ctx.error.message, $ctx.error.type)
//       #end
//       ## if the response status code is not 200, then return an error. Else return the body **
//       #if($ctx.result.statusCode == 200)
//           ## If response is 200, return the body.
//           {
//             "result": "$util.parseJson($ctx.result.body)"
//           }
//       #else
//           ## If response is not 200, append the response to error block.
//           $utils.appendError($ctx.result.body, $ctx.result.statusCode)
//       #end`,
//     });
//     putEventResolver.addDependsOn(apiSchema);

//     const echoLambda = new lambda.Function(this, "echoFunction", {
//       code: lambda.Code.fromInline(
//         "exports.handler = (event, context) => { console.log(event); context.succeed(event); }"
//       ),
//       handler: "index.handler",
//       runtime: lambda.Runtime.NODEJS_10_X,
//     });

//     const rule = new Rule(this, "AppSyncEventBridgeRle", {
//       eventPattern: {
//         source: ["appsync"],
//       },
//     });
//     rule.addTarget(new targets.LambdaFunction(echoLambda));
//   }
// }
