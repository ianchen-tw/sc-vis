import { VisScope } from "./tsScope"

type RunRecordType = "created" | "exited"

export interface RunRecord {
  time: number;
  id: string;
  desc: RunRecordType;
  parent: string | undefined;
}

export const defaultRunRecords: RunRecord[] = [
  { time: 0, id: "t0", desc: "created", parent: undefined },
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

export const validateRunRecords = (records: RunRecord[]): RunRecord[] | undefined => {
  console.log("start validate")

  // Only single root
  const nm_no_parent: number = records.reduce((n, x) => n + (x.parent === undefined ? 1 : 0), 0);
  if (nm_no_parent != 1) {
    return undefined
  }

  return records
}

export const genHistoryFromRunRecords = (records: RunRecord[]) => {
  let scopeTable = new Map<string, VisScope>()

  // currently we only allow one root
  let rootScope: VisScope | undefined = undefined

  const getScope = (id: string | undefined) => {
    if (!id || id === "null") {
      return undefined
    }
    const scope = scopeTable.get(id) ?? undefined
    return scope
  }

  records.forEach((record) => {
    if (record.desc === "created") {
      let parentScope = getScope(record.parent)
      let s = new VisScope(record.id, record.time, parentScope)
      scopeTable.set(s.id, s)
      rootScope = rootScope ?? s;
    } else if (record.desc === "exited") {
      let scope = getScope(record.id)
      scope?.addEndTime(record.time)
    } else {
      console.log(`unknown desc: ${record}`)
    }
  })
  return rootScope
}
