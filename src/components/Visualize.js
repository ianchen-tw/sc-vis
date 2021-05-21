import React from "react"
import ReactFlow, { Background, MiniMap } from "react-flow-renderer"

import { defaultReactFlowItems } from "../lib/default"

const customEdges = {}
class Visualize extends React.Component {
  render() {
    return (
      <div className="border-4 border-red-500" style={{ height: 800 }}>
        <ReactFlow edgeTypes={customEdges} elements={defaultReactFlowItems()}>
          <Background variant="dots" gap={50} size={1} />
          <MiniMap />
        </ReactFlow>
      </div>
    )
  }
}

export default Visualize
