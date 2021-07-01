import React from "react"
import { Handle } from "react-flow-renderer"
import PropTypes from "prop-types"

const ParentScopeNode = ({ data }) => {
  return (
    <div
      className="px-4 py-2 bg-white text-center text-black-400 rounded ring "
      style={{ width: "160px" }}
    >
      <div>{data.label}</div>
      <Handle type="source" position="right" id="fork-start" />
      <Handle type="target" position="right" id="fork-end" />

      <Handle type="target" position="top" id="top" />
      <Handle type="source" position="bottom" id="bottom" />
    </div>
  )
}

ParentScopeNode.propTypes = {
  data: PropTypes.any,
}

export default ParentScopeNode
