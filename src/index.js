import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"

import "./index.css"

// my library
import { genHistoryFromRunRecords, runRecords } from "./lib/runRecord"

import {
  genHistoryFromStructuredData,
  structuredData,
} from "./lib/structuredRecord"

export const run = () => {
  //   let r = genHistoryFromStructuredData(structuredData)
  //   console.log(r.export())

  let r2 = genHistoryFromRunRecords(runRecords)
  console.log(r2.export())
}

ReactDOM.render(<App />, document.getElementById("root"))
