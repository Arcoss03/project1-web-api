import { JSONFile } from "lowdb/node"
import { Data } from "./types"
import { Low } from "lowdb"

const defaultData: Data = { persons: [] }
const adapter = new JSONFile<Data>('db.json')
const db = new Low(adapter, defaultData)

export default db