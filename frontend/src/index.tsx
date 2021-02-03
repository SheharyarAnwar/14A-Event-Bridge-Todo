import React, { useEffect, useState } from "react"

import { ApolloProvider } from "@apollo/client"
import { getClient } from "./Apollo/client"
import Amplify, { Auth } from "aws-amplify"
import awsmobile from "./aws-exports"
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components"

export const GlobalContext = React.createContext<GlobalContextValues | null>(
  null
)
interface GlobalContextValues {
  user: any | null
}

const Index = ({ children }) => {
  Amplify.configure(awsmobile)
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    if (AuthState.SignedIn) {
      Auth.currentAuthenticatedUser()
        .then(userData => {
          const token = userData.signInUserSession.accessToken.jwtToken
          setUser({ ...userData, token })
        })
        .catch(err => {
          setUser(null)
          console.log(err)
        })
    }
    onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedIn) {
        // console.log(authData, "from state shandged")
        const token = (authData as any).signInUserSession.accessToken.jwtToken
        setUser({ ...authData, token })
        setUser(authData)
      } else if (nextAuthState === AuthState.SignOut) {
        setUser(null)
      } else {
        setUser(null)
      }
    })
  }, [])
  return (
    <>
      <GlobalContext.Provider value={{ user: user }}>
        <ApolloProvider client={getClient()}>{children}</ApolloProvider>
      </GlobalContext.Provider>
    </>
  )
}

export default Index
