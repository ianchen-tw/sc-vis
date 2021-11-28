export type VisNodeType = 'task' | 'scope'

export type RunRecordAction = 'created' | 'exited'
export type RunRecordType = VisNodeType

export interface RunRecord {
    time: number;
    name: string;
    desc: RunRecordAction;
    type: RunRecordType;
    parent: string | undefined;
}
