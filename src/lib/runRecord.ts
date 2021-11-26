import { VisNode, VisNodeType } from './scope';

type RunRecordAction = 'created' | 'exited'
type RunRecordType = VisNodeType

export const NAME_ROOT_SCOPE = '__SC_VIS_ROOT_SCOPE__';

export interface RunRecord {
  time: number;
  name: string;
  desc: RunRecordAction;
  type: RunRecordType;
  parent: string | undefined;
}

export const defaultRunRecords: RunRecord[] = [

  {
    time: 0, name: 'A', desc: 'created', type: 'scope', parent: undefined,
  },

  {
    time: 2, name: 'B', desc: 'created', type: 'scope', parent: 'A',
  },
  {
    time: 3, name: 't2', desc: 'created', type: 'task', parent: 'B',
  },
  {
    time: 4, name: 't2', desc: 'exited', type: 'task', parent: 'B',
  },
  {
    time: 6, name: 'B', desc: 'exited', type: 'scope', parent: 'A',
  },

  {
    time: 1, name: 't1', desc: 'created', type: 'task', parent: 'A',
  },
  {
    time: 5, name: 't1', desc: 'exited', type: 'task', parent: 'A',
  },

  {
    time: 7, name: 'A', desc: 'exited', type: 'scope', parent: undefined,
  },

  {
    time: 3.5, name: 'C', desc: 'created', type: 'scope', parent: undefined,
  },
  {
    time: 5, name: 't3', desc: 'created', type: 'task', parent: 'C',
  },
  {
    time: 7, name: 't3', desc: 'exited', type: 'task', parent: 'C',
  },
  {
    time: 4, name: 't4', desc: 'created', type: 'task', parent: 'C',
  },
  {
    time: 9, name: 't4', desc: 'exited', type: 'task', parent: 'C',
  },
  {
    time: 10, name: 'C', desc: 'exited', type: 'scope', parent: undefined,
  },

];

/**
 * Build an scope Tree based on record given
 *  ps. would create a synthetic root node to contains all nodes given
 * @param records
 * @returns Rootnode of the ScopeTree
 */
export const buildScopeTree = (records: RunRecord[]) => {
  const rootScope: VisNode = new VisNode(NAME_ROOT_SCOPE, 'scope', 0, undefined);
  const scopeTable = new Map<string, VisNode>();

  scopeTable.set(NAME_ROOT_SCOPE, rootScope);

  records.forEach((record) => {
    if (record.desc === 'created') {
      const parent = scopeTable.get(record.parent ?? NAME_ROOT_SCOPE) ?? rootScope;

      const s = new VisNode(record.name, record.type, record.time, parent);
      scopeTable.set(s.name, s);
    } else if (record.desc === 'exited') {
      scopeTable.get(record.name)?.end(record.time);
    } else {
      throw new Error(`unknown desc: ${record}`);
    }
  });
  return rootScope;
};
