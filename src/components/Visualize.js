import React from "react"
import ReactFlow from "react-flow-renderer"

// x value

const scale = 100

const getCol = (c) => {
  return c * scale
}

const getRow = (r) => {
  return r * scale
}

const genEdge = (id1, id2) => {
  return {
    id: `${id1}-${id2}`,
    source: id1,
    target: id2,
    animated: true,
    type: "step",
    arrowHeadType: "arrow",
  }
}

const genTask = (nodeName, desc, row, col) => {
  return {
    id: nodeName,
    type: "default",
    data: { label: desc },
    position: { x: getCol(col), y: getRow(row) },
  }
}

const genNursery = (nodeName, desc, row, col) => {
  return {
    id: nodeName,
    type: "default",
    data: { label: desc },
    position: { x: getCol(col), y: getRow(row) },
  }
}

const elements = [
  genTask("t0s", "Root Task Started", 1, 1),
  genNursery("n1s", "Nursery Started", 2, 2),
  genTask("t1s", "Task1 start", 3, 3),
  genTask("t2s", "Task2 start", 4, 4),
  genTask("t1e", "Task1 end", 5, 3),
  genTask("t2e", "Task2 end", 6, 4),
  genNursery("n1e", "Nursery end", 7, 2),
  genTask("t0e", "Root task ended", 8, 1),

  // edges
  genEdge("t0s", "n1s"),

  genEdge("n1s", "t1s"),
  genEdge("n1s", "t2s"),

  genEdge("t1s", "t1e"),
  genEdge("t2s", "t2e"),
  genEdge("t1e", "n1e"),
  genEdge("t2e", "n1e"),
  genEdge("n1e", "t0e"),
]

class Visualize extends React.Component {
  render() {
    return (
      <div className="border-4 border-red-500" style={{ height: 2000 }}>
        <ReactFlow elements={elements} />
      </div>
    )
  }
}

export default Visualize
