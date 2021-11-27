/* eslint max-classes-per-file: ["error", 999] */

/**
 * Task related error strings
 */
export class TaskError {
    public static readonly NOT_CLOSED = 'Task not closed';

    public static readonly CLOSE_VOID = 'Task close before open';

    public static readonly DUPLICATED = 'Task opened twice';
}

export class SCLogsError {
    public static readonly FIELD_MISSING_RUNRECORD = 'Cannot find property: runRecords in sc-logs';

    public static readonly FIELD_MISSING_CONFIG = 'Cannot find property: config in sc-logs';

    public static readonly RUNRECORD_NOT_ARR = 'Field: `runRecords` must be an array';
}
