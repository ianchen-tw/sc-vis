import { RunRecord } from './runRecord';
import { validateJSONLogConfig, validateJSONRunRecord, validateRunRecords } from './sclogs';

test('log config with different values', () => {
  expect(validateJSONLogConfig({})).toBe(true);
  expect(validateJSONLogConfig({ makeDirectScopeTransparent: true })).toBe(true);
  expect(validateJSONLogConfig({ makeDirectScopeTransparent: '996' })).toBe(false);
  expect(validateJSONLogConfig({ makeDirectScopeTransparent: true, aa: 123 })).toBe(false);
});

test('RunRecord inputs', () => {
  expect(validateJSONRunRecord({
    time: 0, name: 'A', desc: 'created', type: 'scope', parent: undefined,
  })).toBe(true);
  expect(validateJSONRunRecord({
    time: 0.34, name: 'A', desc: 'created', type: 'scope', parent: undefined,
  })).toBe(true);
  expect(validateJSONRunRecord({
    time: 0.34, name: 'A', desc: 'created', type: 'task',
  })).toBe(true);
  expect(validateJSONRunRecord({
    time: 0.34, name: 'A', desc: 'created', type: 'task', parent: 'a',
  })).toBe(true);
  expect(validateJSONRunRecord({
    time: 0.34, name: 'A', desc: 'fail', type: 'scope', parent: undefined,
  })).toBe(false);
});

test('RunRecords: Task should close', () => {
  const r1: RunRecord[] = [
    {
      time: 0.34, name: 'A', desc: 'created', type: 'scope', parent: undefined,
    },
  ];
  expect(validateRunRecords(r1).err).toBe(true);
});

test('RunRecords: Task should open only once', () => {
  const r1: RunRecord[] = [
    {
      time: 0.34, name: 'A', desc: 'created', type: 'scope', parent: undefined,
    },
    {
      time: 0.37, name: 'A', desc: 'created', type: 'task', parent: undefined,
    },
    {
      time: 0.35, name: 'A', desc: 'exited', type: 'scope', parent: undefined,
    },
  ];
  expect(validateRunRecords(r1).err).toBe(true);
});
