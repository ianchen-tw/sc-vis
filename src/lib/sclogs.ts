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
export const validateRunRecords = (records: RunRecord[]) => {
  // Validate data constraints

  // Constraint: Created tasks must end
  const openTasks = new Set();
  records.forEach((r) => {
    if (r.desc === 'created') {
      if (openTasks.has(r.name)) {
        throw Error(`task opened twice: ${r}`);
      }
      openTasks.add(r.name);
    } else if (r.desc === 'exited') {
      if (!openTasks.has(r.name)) {
        throw Error(`Task close before open: ${r}`);
      }
      openTasks.delete(r.name);
    }
  });
  if (openTasks.size > 0) {
    throw Error(`Task not closed: ${[...openTasks]}`);
  }
  // Constraint: Must reference node that previous defined

  // Constraint: Task node must be leaf nodes
  //  task must have parent
};

/**
 * Validate the data to be SC Logs
 * @param json an object for validation as an SCLogsResult
 * @returns None
 */
export const parseSCLogs = (json: any): Result<SCLogsResult, Error> => {
  const raw = JSON.parse(json);

  try {
    ensurePropertyExists(raw, LogResultConfigId, 'sclogs');
    ensurePropertyExists(raw, LogResultRunRecordsId, 'sclogs');
    const basicResult = raw as SCLogsResult;
    if (!Array.isArray(basicResult.runRecords)) {
      throw Error('runRecord must be an array');
    }
    // Validate json format
    if (!validateJSONLogConfig(basicResult.config)) {
      throw Error('Failed to parse log config');
    }
    basicResult.runRecords.forEach((rawRecord) => {
      if (!validateJSONRunRecord(rawRecord)) {
        throw Error(`Failed to parse runRecord: ${rawRecord}`);
      }
    });
    const { runRecords } = basicResult;
    validateRunRecords(runRecords);
  } catch (e) {
    return Err(e as Error);
  }

  return Ok(raw as SCLogsResult);
};
