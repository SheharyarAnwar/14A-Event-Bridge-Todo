import React, { useEffect, useLayoutEffect } from "react"
import { Router } from "@reach/router"
import Dashboard from "../views/Dashboard"
import ProtectedRouteWrapper from "../Components/ProtectedRouteWrapper"
import { navigate } from "gatsby"
const App = () => {
  useEffect(() => {
    typeof window !== "undefined" && navigate("/app/dashboard")
  }, [])

  return (
    <Router basepath="/app">
      <ProtectedRouteWrapper path="/dashboard" component={<Dashboard />} />
    </Router>
  )
}

export default App
