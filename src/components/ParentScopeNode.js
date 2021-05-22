import React from "react"
import { Handle } from "react-flow-renderer"

const ParentScopeNode = ({ data }) => {
  return (
    <div className="rounded text-black-400 bg-green-300 px-4 py-2">
      <Handle type="target" position="top" id="top" />
      <div>{data.label}</div>
      <Handle type="source" position="right" id="fork" />
      <Handle type="source" position="bottom" id="bottom" />
    </div>
  )
}

export default ParentScopeNode
