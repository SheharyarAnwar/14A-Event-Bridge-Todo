import React, { useContext, useEffect } from "react"
import Header from "../Components/Header"
import Hugo from "../Assets/hugo.svg"
import { GlobalContext } from "../index"
import { navigate } from "gatsby"

export default function Home() {
  const context = useContext(GlobalContext)
  if (context?.user) {
    navigate("/app/dashboard")
  }
  return (
    <div>
      <Header text="Login" />
      <Hugo width={700} />
    </div>
  )
}
