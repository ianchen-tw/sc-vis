import { Scope } from "./scope"
export const structuredData = {
  id: "t0",
  start: 0,
  end: 6,
  children: [
    {
      id: "n1",
      start: 1,
      children: [
        { id: "t1", start: 2, end: 4 },
        { id: "t2", start: 3, end: 5 },
      ],
    },
  ],
}

export const genHistoryFromStructuredData = (d) => {
  // retun
  let exploreNode = (n, parent) => {
    let curScope = Scope(n.id, n.start, parent)
    if (n.children !== undefined) {
      n.children.forEach((x) => {
        exploreNode(x, curScope)
      })
    }
    if (n.end !== undefined) {
      curScope.addEndTime(n.end)
    }
    return curScope
  }
  let root = exploreNode(d, null)
  return root
}
