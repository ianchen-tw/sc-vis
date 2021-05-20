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

const startNodeId = (scope) => {
  return `${scope.id}s`
}
const endNodeId = (scope) => {
  return `${scope.id}e`
}

const locForCol = (c) => {
  return c * 200
}
const locForRow = (r) => {
  return r * 100
}

const reactFlowNode = (nodeName, desc, row, col) => {
  return {
    id: nodeName,
    type: "default",
    data: { label: desc },
    position: { x: locForCol(col), y: locForRow(row) },
  }
}

const reactFlowEdge = (id1, id2) => {
  return {
    id: `${id1}-${id2}`,
    source: id1,
    target: id2,
    animated: true,
    type: "step",
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
        scope.loc.col
      )
    )
    // end node
    items.push(
      reactFlowNode(
        endNodeId(scope),
        `${scope.id} end`,
        scope.lifespan.end,
        scope.loc.col
      )
    )
    // link between start and end nodes
    items.push(reactFlowEdge(startNodeId(scope), endNodeId(scope)))

    // children
    scope.children.forEach((childScope) => {
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
