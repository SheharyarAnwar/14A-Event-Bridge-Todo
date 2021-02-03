import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignOut,
  AmplifySignUp,
} from "@aws-amplify/ui-react"
import React, { useEffect, useState } from "react"
import classes from "./index.module.css"
interface HeaderProps {
  text: string
}
const Index: React.FC<HeaderProps> = ({ text }) => {
  const [authenticatorOpen, setAuthenticatorOpen] = useState<boolean>(false)
  return (
    <>
      <div className={classes.root}>
        <h3 className={classes.logo}>Todo App</h3>

        <h5
          className={classes.register}
          onClick={() => setAuthenticatorOpen(true)}
        >
          {text}
        </h5>
      </div>
      {authenticatorOpen ? (
        text === "Login" ? (
          <AmplifyAuthenticator usernameAlias={"email"}></AmplifyAuthenticator>
        ) : (
          <AmplifySignOut />
        )
      ) : null}
    </>
  )
}

export default Index
