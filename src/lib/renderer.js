const startNodeId = (scope) => `${scope.id}s`
const endNodeId = (scope) => `${scope.id}e`

const locForCol = (c) => c * 150
const locForRow = (r) => r * 100

const Node = ({ id, desc, row, col, type = "parentScope" }) => {
  return {
    id: id,
    type: type,
    data: { label: desc },
    position: { x: locForCol(col), y: locForRow(row) },
  }
}

const EdgeStyles = Object.freeze({
  startToEnd: {
    stroke: "#6B7280",
    strokeWidth: "2",
  },
  forkStart: {
    stroke: "#3B82F6",
  },
  forkEnd: {
    stroke: "#3B82F6",
  },
})

const Edge = ({
  source,
  target,
  sourceHandle,
  targetHandle,
  style,
  animated = true,
}) => {
  return {
    id: `e${source}-${target}`,
    source: source,
    target: target,
    sourceHandle: sourceHandle,
    targetHandle: targetHandle,
    type: "step",
    animated: animated,
    style: EdgeStyles[style],
    arrowHeadType: "arrow",
  }
}

const DefaultNodeRenderer = (scope, renderResult) => {
  let scopeStart = Node({
    id: startNodeId(scope),
    desc: `${scope.id} start`,
    row: scope.lifespan.start,
    col: scope.loc.col,
  })
  let scopeEnd = Node({
    id: endNodeId(scope),
    desc: `${scope.id} end`,
    row: scope.lifespan.end,
    col: scope.loc.col,
  })
  renderResult.push(scopeStart, scopeEnd)
}

const ParentChildEdgeRender = (parentScope, childScope, rederResult) => {
  // parent scope start node to child start
  let childStartEdge = Edge({
    source: startNodeId(parentScope),
    target: startNodeId(childScope),
    sourceHandle: "fork-start",
    targetHandle: "top",
    style: "forkStart",
  })
  // child end node to parent end node
  let childEndEdge = Edge({
    source: endNodeId(childScope),
    target: endNodeId(parentScope),
    sourceHandle: "bottom",
    targetHandle: "fork-end",
    style: "forkEnd",
  })
  rederResult.push(childStartEdge, childEndEdge)
}

const NodeLifetimeEdgeRender = (scope, rederResult) => {
  let startToEnd = Edge({
    source: startNodeId(scope),
    target: endNodeId(scope),
    sourceHandle: "bottom",
    targetHandle: "top",
    style: "startToEnd",
    animated: false,
  })
  rederResult.push(startToEnd)
}

// Traverse the whole tree and call renderers
const ScopeRenderVisitor = (
  root_scope,
  nodeRenderer,
  nodeLifetimeEdgeRender,
  parentChildEdgeRender
) => {
  let renderResult = []
  const visitScope = (scope) => {
    nodeRenderer(scope, renderResult)
    nodeLifetimeEdgeRender(scope, renderResult)
    scope.children.forEach((childScope) => {
      visitScope(childScope)
      parentChildEdgeRender(scope, childScope, renderResult)
    })
  }
  visitScope(root_scope)
  return renderResult
}

export const getScopeRenderResult = (rootScope) => {
  return ScopeRenderVisitor(
    rootScope,
    DefaultNodeRenderer,
    NodeLifetimeEdgeRender,
    ParentChildEdgeRender
  )
}