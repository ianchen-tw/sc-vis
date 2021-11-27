/* eslint max-classes-per-file: ["error", 999] */

/**
 * RunRecord related error strings
 */
export class RunRecordError {
    public static readonly NOT_CLOSED = 'Node not closed';

    public static readonly CLOSE_VOID = 'Node close before open';

    public static readonly DUPLICATED = 'Node opened twice';
}

export class SCLogsError {
    public static readonly FIELD_MISSING_RUNRECORD = 'Cannot find property: runRecords in sc-logs';

    public static readonly FIELD_MISSING_CONFIG = 'Cannot find property: config in sc-logs';

    public static readonly RUNRECORD_NOT_ARR = 'Field: `runRecords` must be an array';
}
