import React, { Component, useContext, useEffect } from "react"
import { GlobalContext } from "../.."
import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
interface ProtectedRouteProps extends RouteComponentProps {
  component: React.ReactNode
}
const Index: React.FC<ProtectedRouteProps> = ({ component }) => {
  const context = useContext(GlobalContext)
  if (!context.user) {
    navigate("/")
  }
  return <>{component}</>
}

export default Index
