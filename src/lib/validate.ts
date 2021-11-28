import { Ok, Err, Result } from 'ts-results';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { RunRecordErrStr, SCLogsErrStr } from './const';
import { RunRecord } from './types';

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

export const ajvValidateJSONLogConfig = ajv.compile(SchemaLogConfig);
export const ajvValidateJSONRunRecord = ajv.compile(SchemaRunRecord);

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
  const openNodes: Map<string, RunRecord> = new Map();
  for (const r of records) {
    if (r.desc === 'created') {
      if (openNodes.has(r.name)) {
        return Err(new ExplainableErr(RunRecordErrStr.DUPLICATED, r));
      }
      openNodes.set(r.name, r);
    } else if (r.desc === 'exited') {
      if (!openNodes.has(r.name)) {
        return Err(new ExplainableErr(RunRecordErrStr.CLOSE_VOID, r));
      }
      openNodes.delete(r.name);
    }
  }
  if (openNodes.size > 0) {
    const leftScopes: RunRecord[] = [];
    const leftTasks: RunRecord[] = [];
    openNodes.forEach((r, _) => {
      switch (r.type) {
        case 'scope': leftScopes.push(r); break;
        case 'task': leftTasks.push(r); break;
      }
    });
    if (leftScopes.length > 0) {
      console.log('warning: scope not closed', leftScopes);
    }
    // Only un-closed task leads to error
    if (leftTasks.length > 0) {
      return Err(new ExplainableErr(RunRecordErrStr.NOT_CLOSED, [...openNodes]));
    }
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
export const validateSCLogs = (json: any): Result<SCLogsResult, ExplainableErr> => {
  const raw = JSON.parse(json);

  if (!propertyExists(raw, LogResultConfigId)) {
    return Err(new ExplainableErr(SCLogsErrStr.FIELD_MISSING_CONFIG));
  }
  if (!propertyExists(raw, LogResultRunRecordsId)) {
    return Err(new ExplainableErr(SCLogsErrStr.FIELD_MISSING_RUNRECORD));
  }

  const basicResult = raw as SCLogsResult;
  if (!Array.isArray(basicResult.runRecords)) {
    return Err(new ExplainableErr(SCLogsErrStr.RUNRECORD_NOT_ARR));
  }

  // Validate json format
  if (!ajvValidateJSONLogConfig(basicResult.config)) {
    return Err(new ExplainableErr('Failed to parse log config'));
  }
  for (const rawRecord of basicResult.runRecords) {
    if (!ajvValidateJSONRunRecord(rawRecord)) {
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
