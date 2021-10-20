
export interface LifeSpan {
    start: number;
    end: number | undefined;
}
export class VisScope {
    id: string;
    lifespan: LifeSpan;
    children: VisScope[]
    parent: VisScope | undefined

    constructor(id: string, start: number, parent: VisScope | undefined = undefined) {
        this.id = id
        this.lifespan = { start: start, end: undefined }
        this.children = []
        this.parent = undefined
        parent?.addChildren(this)
    }

    addChildren(child: VisScope) {
        // parent need to start before children
        if (this.lifespan.start <= child.lifespan.start) {
            this.children.push(child)
            child.parent = this
        } else {
            throw Error(`Cannot add child start earlier than parent,
                child_start: ${child.lifespan.start}
                parent_start: ${this.lifespan.start}`)
        }
    }

    addEndTime(end: number) {
        if (this.lifespan.end === undefined
            || end > this.lifespan.end
        ) {
            this.lifespan.end = end
        }
        this.reportEndTimeToParent()
    }

    // enlarge Parent's lifespan based on children's
    reportEndTimeToParent() {
        if (this.lifespan.end !== undefined) {
            this.parent?.addEndTime(this.lifespan.end)
        }
    }

}