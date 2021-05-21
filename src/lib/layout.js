// arrange layout for a scope
export const arrange_cols = (root_scope) => {
  let next_col = 1

  let give_col = (scope) => {
    scope.loc.col = next_col
    next_col++
    scope.children.forEach((childScope) => {
      give_col(childScope)
    })
  }
  give_col(root_scope)
}

const startNodeId = (scope) => `${scope.id}s`
const endNodeId = (scope) => `${scope.id}e`

const locForCol = (c) => c * 200
const locForRow = (r) => r * 100

const reactFlowNode = (
  nodeName,
  desc,
  row,
  col,
  srcPos = "top",
  dstPos = "bottom"
) => {
  return {
    id: nodeName,
    type: "default",
    data: { label: desc },
    sourcePosition: srcPos,
    targetPosition: dstPos,
    position: { x: locForCol(col), y: locForRow(row) },
  }
}

const reactFlowEdge = (id1, id2, edgeType = "step", data) => {
  return {
    id: `${id1}-${id2}`,
    source: id1,
    target: id2,
    animated: true,
    type: edgeType,
    data: data,
    style: { stroke: "#f6ab6c" },
    arrowHeadType: "arrow",
  }
}

// generate items for react flow based on scope tree
export const genReactFlowItems = (root_scope) => {
  let items = []

  let genForScope = (scope) => {
    // start node
    items.push(
      reactFlowNode(
        startNodeId(scope),
        `${scope.id} start`,
        scope.lifespan.start,
        scope.loc.col,
        "right",
        "top"
      )
    )
    // end node
    items.push(
      reactFlowNode(
        endNodeId(scope),
        `${scope.id} end`,
        scope.lifespan.end,
        scope.loc.col,
        "bottom",
        "right"
      )
    )
    // link between start and end nodes
    items.push(reactFlowEdge(startNodeId(scope), endNodeId(scope)))

    // children
    scope.children.forEach((childScope, index, arr) => {
      genForScope(childScope)
      // link from parent start to children start

      items.push(reactFlowEdge(startNodeId(scope), startNodeId(childScope)))

      // link from children end to parent end
      items.push(reactFlowEdge(endNodeId(childScope), endNodeId(scope)))
    })
  }
  genForScope(root_scope)
  return items
}
