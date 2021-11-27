import { Ok, Err, Result } from 'ts-results';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';

import { RunRecord } from './runRecord';

const ajv = new Ajv();

export interface LogConfig {
  makeDirectScopeTransparent: boolean | undefined;
}

export const SchemaLogConfig: JTDSchemaType<LogConfig> = {
  optionalProperties: {
    makeDirectScopeTransparent: { type: 'boolean' },
  },
};

export const SchemaRunRecord: JTDSchemaType<RunRecord> = {
  properties: {
    time: { type: 'float64' },
    name: { type: 'string' },
    desc: { enum: ['created', 'exited'] },
    type: { enum: ['task', 'scope'] },
  },
  optionalProperties: {
    parent: { type: 'string' },
  },
};

export const validateJSONLogConfig = ajv.compile(SchemaLogConfig);
export const validateJSONRunRecord = ajv.compile(SchemaRunRecord);

export interface SCLogsResult {
  config: LogConfig;
  runRecords: RunRecord[];
}

const LogResultConfigId: keyof SCLogsResult = 'config';
const LogResultRunRecordsId: keyof SCLogsResult = 'runRecords';

class ExplainableErr extends Error {
  hintObject: any | undefined;

  constructor(message: string | undefined, hintObject: any | undefined = undefined) {
    super(message);
    this.hintObject = hintObject;
  }
}

const ensurePropertyExists = (
  obj: any,
  property: string,
  objName: string | undefined = undefined,
) => {
  if (!Object.prototype.hasOwnProperty.call(obj, property)) {
    const msg = `Cannot find property ${property}`;
    const tailMsg = objName === undefined ? '' : ` in object ${objName}`;
    throw Error(msg + tailMsg);
  }
};

/**
 * Would raise Error if failed
 * @param records
 */
export const validateRunRecords = (records: RunRecord[]): Result<boolean, ExplainableErr> => {
  // Validate data constraints

  // Constraint: Created tasks must end
  const openTasks = new Set();

  try {
    records.forEach((r) => {
      if (r.desc === 'created') {
        if (openTasks.has(r.name)) {
          Err(new ExplainableErr('task opened twice', r)).unwrap();
        }
        openTasks.add(r.name);
      } else if (r.desc === 'exited') {
        if (!openTasks.has(r.name)) {
          Err(new ExplainableErr('Task close before open', r)).unwrap();
        }
        openTasks.delete(r.name);
      }
    });
  } catch (explainableErr) {
    return Err(explainableErr as ExplainableErr);
  }

  if (openTasks.size > 0) {
    return Err(new ExplainableErr('Task not closed', [...openTasks]));
  }
  return Ok(true);
  // Constraint: Must reference node that previous defined

  // Constraint: Task node must be leaf nodes
  //  task must have parent
};

/**
 * Validate the data to be SC Logs
 * @param json an object for validation as an SCLogsResult
 * @returns None
 */
export const parseSCLogs = (json: any): Result<SCLogsResult, ExplainableErr> => {
  const raw = JSON.parse(json);

  try {
    ensurePropertyExists(raw, LogResultConfigId, 'sclogs');
    ensurePropertyExists(raw, LogResultRunRecordsId, 'sclogs');
    const basicResult = raw as SCLogsResult;
    if (!Array.isArray(basicResult.runRecords)) {
      Err(new ExplainableErr('runRecord must be an array')).unwrap();
    }
    // Validate json format
    if (!validateJSONLogConfig(basicResult.config)) {
      Err(new ExplainableErr('Failed to parse log config')).unwrap();
    }
    basicResult.runRecords.forEach((rawRecord) => {
      if (!validateJSONRunRecord(rawRecord)) {
        console.log(validateJSONRunRecord.errors);
        console.log('record: ', rawRecord);
        Err(new ExplainableErr('Failed to parse runRecord', rawRecord)).unwrap();
      }
    });
    const { runRecords } = basicResult;
    validateRunRecords(runRecords).unwrap();
  } catch (explainableErr) {
    return Err(explainableErr as ExplainableErr);
  }
  return Ok(raw as SCLogsResult);
};
