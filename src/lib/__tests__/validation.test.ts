import { Result } from 'ts-results';
import {
  validateJSONLogConfig,
  validateJSONRunRecord,
  validateRunRecords,
  ExplainableErr,
} from '../sclogs';
import { TaskError } from '../err';

describe.each([
  ['Optional', {}, true],
  ['Normal', { makeDirectScopeTransparent: true }, true],
  ['Wrong type', { makeDirectScopeTransparent: '996' }, false],
  ['Extra fields', { makeDirectScopeTransparent: true, aa: 123 }, false],
])('Ajv LogConfig parsing', (caseName: string, obj: any, expected: boolean) => {
  test(`case: ${caseName}`, () => {
    expect(validateJSONLogConfig(obj)).toBe(expected);
  });
});

describe.each([
  {
    time: 0, name: 'A', desc: 'created', type: 'scope', parent: undefined, expected: true,
  },
  {
    time: 0.34, name: 'A', desc: 'created', type: 'scope', parent: undefined, expected: true,
  },
  {
    time: 0.34, name: 'A', desc: 'created', type: 'task', expected: true,
  },
  {
    time: 0.34, name: 'A', desc: 'created', type: 'else', expected: false,
  },
  {
    time: 0.34, name: 'A', desc: 'created', type: 'task', parent: 'a', expected: true,
  },
  {
    time: 0.34, name: 'A', desc: 'fail', type: 'scope', parent: undefined, expected: false,
  },
])('Ajv runRecord parsing', ({
  time, name, desc, type, parent, expected,
}) => {
  test('pass', () => {
    const obj = {
      time, name, desc, type, parent,
    };
    expect(validateJSONRunRecord(obj)).toBe(expected);
  });
});

const resultShouldErrWith = (result: Result<boolean, ExplainableErr>, expectMsg: string) => {
  expect(result.err).toBe(true);
  if (result.err) {
    const err: ExplainableErr = result.val;
    expect(err.message).toBe(expectMsg);
  } else {
    throw new Error('Something went wrong with our test logic');
  }
};

describe('RunRecords validation', () => {
  const expectErrMsg = (input: any, msg: string) => {
    resultShouldErrWith(validateRunRecords(input), msg);
  };

  test('Should report task not closed', () => {
    expectErrMsg([
      {
        time: 0.34, name: 'A', desc: 'created', type: 'scope', parent: undefined,
      },
    ], TaskError.NOT_CLOSED);
  });

  test('Should report duplicated tasks', () => {
    expectErrMsg([
      {
        time: 0.34, name: 'A', desc: 'created', type: 'scope', parent: undefined,
      },
      {
        time: 0.37, name: 'A', desc: 'created', type: 'task', parent: undefined,
      },
      {
        time: 0.35, name: 'A', desc: 'exited', type: 'scope', parent: undefined,
      },
    ], TaskError.DUPLICATED);
  });
});
