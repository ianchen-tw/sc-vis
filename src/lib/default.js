// my library
import { genHistoryFromRunRecords, runRecords } from "./runRecord"
import { arrangeCols } from "./layout"
import { getScopeRenderResult } from "./renderer"
import {
  genHistoryFromStructuredData,
  structuredData,
} from "./structuredRecord"

export const defaultReactFlowItems = () => {
  //   let r = genHistoryFromStructuredData(structuredData)
  //   console.log(r.export())

  let r2 = genHistoryFromRunRecords(runRecords)
  arrangeCols(r2)
  let items = getScopeRenderResult(r2)

  return items
}
