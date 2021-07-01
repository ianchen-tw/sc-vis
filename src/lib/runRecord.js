import { Scope } from "./scope"

export const defaultRunRecords = [
  { time: 0, id: "t0", desc: "created", parent: null },
  { time: 1, id: "n1", desc: "created", parent: "t0" },
  { time: 2, id: "n2", desc: "created", parent: "t0" },
  { time: 2, id: "t1", desc: "created", parent: "n1" },
  { time: 3, id: "t2", desc: "created", parent: "n1" },
  { time: 4, id: "t1", desc: "exited", parent: "n1" },
  { time: 4, id: "n2", desc: "exited", parent: "t0" },
  { time: 5, id: "t2", desc: "exited", parent: "n1" },
  { time: 5, id: "n1", desc: "exited", parent: "t0" },
  { time: 6, id: "n1", desc: "exited", parent: "t0" },
]

export const validateRunRecords = (runRecords) => {
  console.log("start validate")
  runRecords.forEach((record) => {
    record
  })
  return true
}

export const genHistoryFromRunRecords = (records) => {
  let scopes = {}

  // currently we only allow one root
  let rootScope = null

  const getScope = (id) => {
    if (!id || id === "null") {
      return null
    }
    return scopes[id]
  }

  records.forEach((record) => {
    if (record.desc === "created") {
      let parentScope = getScope(record.parent)
      let scope = Scope(record.id, record.time, parentScope)
      scopes[scope.id] = scope
      if (parentScope === null) {
        rootScope = scope
      }
    } else if (record.desc === "exited") {
      let scope = getScope(record.id)
      scope.addEndTime(record.time)
    } else {
      console.log(`unknown desc: ${record}`)
    }
  })
  return rootScope
}
