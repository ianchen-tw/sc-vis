import React from "react"
import ReactFlow from "react-flow-renderer"
import { defaultReactFlowItems } from "../lib/default"

class Visualize extends React.Component {
  render() {
    return (
      <div className="border-4 border-red-500" style={{ height: 2000 }}>
        <ReactFlow elements={defaultReactFlowItems()} />
      </div>
    )
  }
}

export default Visualize
