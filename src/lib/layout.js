// arrange layout for a scope
export const arrangeCols = (root_scope) => {
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
