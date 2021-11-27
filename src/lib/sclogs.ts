import { Ok, Err, Result } from 'ts-results';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { TaskError, SCLogsError } from './err';
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

export class ExplainableErr extends Error {
  hintObject: any | undefined;

  constructor(message: string | undefined, hintObject: any | undefined = undefined) {
    super(message);
    this.hintObject = hintObject;
  }
}

const propertyExists = (
  obj: any,
  property: string,
) => Object.prototype.hasOwnProperty.call(obj, property);

/**
 * Validate data-related constraints
 * @param records
 */
export const validateRunRecords = (records: RunRecord[]): Result<boolean, ExplainableErr> => {
  // Validate data constraints

  // Constraint: Created tasks must end
  const openTasks = new Set();
  for (const r of records) {
    if (r.desc === 'created') {
      if (openTasks.has(r.name)) {
        return Err(new ExplainableErr(TaskError.DUPLICATED, r));
      }
      openTasks.add(r.name);
    } else if (r.desc === 'exited') {
      if (!openTasks.has(r.name)) {
        return Err(new ExplainableErr(TaskError.CLOSE_VOID, r));
      }
      openTasks.delete(r.name);
    }
  }
  if (openTasks.size > 0) {
    return Err(new ExplainableErr(TaskError.NOT_CLOSED, [...openTasks]));
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

  if (!propertyExists(raw, LogResultConfigId)) {
    return Err(new ExplainableErr(SCLogsError.FIELD_MISSING_CONFIG));
  }
  if (!propertyExists(raw, LogResultRunRecordsId)) {
    return Err(new ExplainableErr(SCLogsError.FIELD_MISSING_RUNRECORD));
  }

  const basicResult = raw as SCLogsResult;
  if (!Array.isArray(basicResult.runRecords)) {
    return Err(new ExplainableErr(SCLogsError.RUNRECORD_NOT_ARR));
  }

  // Validate json format
  if (!validateJSONLogConfig(basicResult.config)) {
    return Err(new ExplainableErr('Failed to parse log config'));
  }
  for (const rawRecord of basicResult.runRecords) {
    if (!validateJSONRunRecord(rawRecord)) {
      return Err(new ExplainableErr('Failed to parse runRecord', rawRecord));
    }
  }

  // Data-related constraints
  const { runRecords } = basicResult;
  const constraintResults = validateRunRecords(runRecords);
  if (constraintResults.err) {
    return constraintResults;
  }

  return Ok(raw as SCLogsResult);
};
