import React from "react"
// import Visualize from "./Visualize"
import Header from "./Header"
import { useState } from "react"
import BarChart from "./BarChart"

import { defaultRunRecords } from "../lib/runRecord"

const App = () => {
  // const [records, setRecords] = useState(defaultRunRecords)
  const [setRecords] = useState(defaultRunRecords)

  return (
    <div className="container mx-auto px-4 h-screen flex flex-col">
      <div className="flex-none">
        <Header onRecordsUpdate={(data) => setRecords(data)} />
      </div>
      <div className="flex-grow">
        {/* <Visualize runRecords={records} /> */}
        <BarChart data={[5, 10, 1, 3]} size={[500, 500]} />
      </div>
    </div>
  )
}

export default App
