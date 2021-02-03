import React from "react"
import RootWrapper from "./src/index"
import "./src/index.css"
export const wrapRootElement = ({ element }) => {
  return <RootWrapper>{element}</RootWrapper>
}
