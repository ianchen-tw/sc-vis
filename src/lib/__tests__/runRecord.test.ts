import {
  NAME_ROOT_SCOPE, buildScopeTree,
} from '../scopeTree';
import { RunRecord } from '../types';
import defaultRunRecords from '../defaultRecords';

test('multi root', () => {
  const data: RunRecord[] = [
    {
      time: 0, name: 't0', desc: 'created', type: 'task', parent: undefined,
    },
    {
      time: 0, name: 't1', desc: 'created', type: 'task', parent: undefined,
    },
    {
      time: 1, name: 't0', desc: 'exited', type: 'task', parent: undefined,
    },
    {
      time: 1, name: 't1', desc: 'exited', type: 'task', parent: undefined,
    },
  ];
  const root = buildScopeTree(data);
  expect(root.name).toBe(NAME_ROOT_SCOPE);

  const nodeNames = Array.from(root.children, (node) => node.name);
  expect(nodeNames).toEqual(expect.arrayContaining(['t0', 't1']));
});

test('default records', () => {
  const root = buildScopeTree(defaultRunRecords);
  expect(root.name).toBe(NAME_ROOT_SCOPE);
});
