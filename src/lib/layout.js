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

const reactFlowEdge = (id1, id2, edgeType = "step") => {
  return {
    id: `${id1}-${id2}`,
    source: id1,
    target: id2,
    animated: true,
    type: edgeType,

    style: { stroke: "#f6ab6c" },
    arrowHeadType: "arrow",
  }
}

export const genStartEndItems = (root_scope) => {
  let items = []
  let gen = (scope) => {
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
    items.push(reactFlowEdge(startNodeId(scope), endNodeId(scope)))
    // children
    scope.children.forEach((childScope) => {
      gen(childScope)
    })
  }
  gen(root_scope)
  return items
}

export const genParentChildForkItems = (root_scope) => {
  let items = []
  const startFork = (scope) => `${scope.id}sf`
  const endFork = (scope) => `${scope.id}ef`

  let gen = (scope) => {
    if (scope.children.length === 0) {
      // only generate if have children
      return
    }
    // start fork node
    items.push(
      reactFlowNode(
        startFork(scope),
        `${scope.id} start`,
        scope.lifespan.start,
        scope.loc.col,
        "right",
        "top"
      )
    )
    // end fork node
    items.push(
      reactFlowNode(
        endFork(scope),
        `${scope.id} end`,
        scope.lifespan.end,
        scope.loc.col,
        "top", // not used
        "right"
      )
    )

    // children
    scope.children.forEach((childScope) => {
      items.push(reactFlowEdge(startFork(scope), startNodeId(childScope)))

      items.push(reactFlowEdge(endNodeId(childScope), endFork(scope)))
      gen(childScope)
    })
  }
  gen(root_scope)
  return items
}

export const genReactFlowItems = (root_scope) => {
  let items = []
  items.push(...genStartEndItems(root_scope))
  items.push(...genParentChildForkItems(root_scope))
  return items
}
