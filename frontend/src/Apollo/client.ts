import Amplify, { Auth } from "aws-amplify"
import awsconfig from "../aws-exports"
import AWSAppSyncClient, { AUTH_TYPE } from "aws-appsync"
import { createAuthLink } from "aws-appsync-auth-link"
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client"
Amplify.configure(awsconfig)
export const getClient = () => {
  const url = awsconfig.aws_appsync_graphqlEndpoint
  const region = awsconfig.aws_appsync_region
  const auth = {
    type: AUTH_TYPE["AMAZON_COGNITO_USER_POOLS"] as "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken(),
  }
  // console.log(auth)
  const link = ApolloLink.from([
    createAuthLink({ url, region, auth }),
    createHttpLink({ uri: url }),
  ])
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  })
}
