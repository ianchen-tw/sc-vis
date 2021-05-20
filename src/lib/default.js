// my library
import { genHistoryFromRunRecords, runRecords } from "./runRecord"
import { genReactFlowItems, arrange_cols } from "./layout"
import {
  genHistoryFromStructuredData,
  structuredData,
} from "./structuredRecord"

export const defaultReactFlowItems = () => {
  //   let r = genHistoryFromStructuredData(structuredData)
  //   console.log(r.export())

  let r2 = genHistoryFromRunRecords(runRecords)
  arrange_cols(r2)
  let items = genReactFlowItems(r2)
  return items
}
