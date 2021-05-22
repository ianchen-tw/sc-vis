import React from "react"
import ReactFlow, { Background, MiniMap, Controls } from "react-flow-renderer"

import { defaultReactFlowItems } from "../lib/default"
import ParentScopeNode from "./ParentScopeNode"

const customEdges = {}
const customNodeTypes = {
  parentScope: ParentScopeNode,
}

class Visualize extends React.Component {
  render() {
    return (
      <div className="border-2 border-blue-200 w-full h-full">
        <ReactFlow
          edgeTypes={customEdges}
          nodeTypes={customNodeTypes}
          elements={defaultReactFlowItems()}
        >
          <Background variant="dots" gap={50} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    )
  }
}

export default Visualize
