import React from "react"
import ReactFlow, { MiniMap, Controls } from "react-flow-renderer"
import PropTypes from "prop-types"

import ParentScopeNode from "./ParentScopeNode"

import { genHistoryFromRunRecords } from "../lib/runRecord"
import { arrangeCols } from "../lib/layout"
import { getScopeRenderResult } from "../lib/renderer"

const customEdges = {}
const customNodeTypes = {
  parentScope: ParentScopeNode,
}

const Visualize = ({ runRecords }) => {
  let r2 = genHistoryFromRunRecords(runRecords)
  arrangeCols(r2)
  let items = getScopeRenderResult(r2)
  return (
    <div className="border-2 border-blue-200 w-full h-full">
      <ReactFlow
        edgeTypes={customEdges}
        nodeTypes={customNodeTypes}
        elements={items}
      >
        {/* <Background variant="dots" gap={50} size={1} /> */}
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  )
}
Visualize.propTypes = {
  runRecords: PropTypes.array,
}

export default Visualize
