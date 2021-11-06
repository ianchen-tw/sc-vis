import { HierarchyNode, hierarchy } from 'd3-hierarchy';
import { VisNode } from './scope';
import { NAME_ROOT_SCOPE } from './runRecord';

export interface ScopeResult {
  startTask: string;
  endTask: string;
  scope: VisNode;
}

export interface ScopeRange {
  startRow: number;
  endRow: number;
}

export interface ReorderResult {
  tasks: VisNode[];
  scopeResults: ScopeResult[]
}

export const reorderByScopes = (scopeTree: VisNode): ReorderResult => {
  const root = hierarchy<VisNode>(scopeTree);

  root.sum((d) => (d.type === 'task' ? 1 : 0))
    .sort((a, b) => a.data.lifespan.start - b.data.lifespan.start);

  const taskResult: VisNode[] = [];
  const scopeTable = new Map<VisNode, ScopeRange>();

  // node.value: number of task node under this scope
  const dfsScope = (node: HierarchyNode<VisNode>, startRow: number) => {
    if (node.data.type === 'task') {
      throw Error('Should not call this func with task');
    }
    if (node.children === undefined) {
      // Scope with no tasks
      return;
    }

    // current amount of allocated tasks in layout
    let curRow = startRow;
    node.children.forEach((childNode) => {
      switch (childNode.data.type) {
        case 'task':
          taskResult.push(childNode.data);
          break;
        case 'scope':
          dfsScope(childNode, curRow);
          break;
      }
      curRow += childNode.value ?? 0;
    });

    const nmTasksUnderScope = node.value ?? 0;
    const range: ScopeRange = { startRow, endRow: startRow + nmTasksUnderScope - 1 };
    const visScope: VisNode = node.data;

    // Do not show root scope (only used in building trees)
    if (visScope.name !== NAME_ROOT_SCOPE) {
      scopeTable.set(visScope, range);
    }

    // TODO: This is an impl specific behavior (Python-trio)
    if (visScope.children.length === 1 && visScope.children[0].type === 'task') {
      scopeTable.delete(visScope);
    }
  };
  dfsScope(root, 0);
  // console.log("scope_table", scope_table)
  // console.log(task_result)
  const scopeResults: ScopeResult[] = [];
  scopeTable.forEach((range: ScopeRange, scope: VisNode) => {
    const firstTask = taskResult[range.startRow];
    const lastTask = taskResult[range.endRow];

    scopeResults.push({
      startTask: firstTask.name,
      endTask: lastTask.name,
      scope,
    });
  });
  return { tasks: taskResult, scopeResults };
};
