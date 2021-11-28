import { RunRecord } from './types';

const defaultRunRecords: RunRecord[] = [
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

export default defaultRunRecords;
