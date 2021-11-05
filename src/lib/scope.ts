export type VisNodeType = 'task' | 'scope'

export interface LifeSpan {
  start: number;
  end: number;
}

export class VisNode {
  name: string;

  lifespan: LifeSpan;

  children: VisNode[];

  parent: VisNode | undefined;

  type: VisNodeType;

  // stop updating the lifetime of this node
  #frozen: boolean;

  constructor(name: string, type: VisNodeType,
    start: number, parent: VisNode | undefined = undefined) {
    this.name = name;
    this.type = type;
    this.lifespan = { start, end: start };
    this.children = [];
    this.parent = undefined;
    this.#frozen = false;
    parent?.addChildren(this);
  }

  end(end: number) {
    this.addEndTime(end);
    this.#frozen = true;
    // console.log(`${this.name} froze with ${end}`)
  }

  addChildren(child: VisNode) {
    // parent need to be scope type
    if (this.type !== 'scope') {
      throw Error('Only scope node can have children');
    }
    // parent need to start before children
    if (this.lifespan.start <= child.lifespan.start) {
      this.children.push(child);
      child.parent = this;
    } else {
      throw Error(`Cannot add child start earlier than parent,
                child_start: ${child.lifespan.start}
                parent_start: ${this.lifespan.start}`);
    }
  }

  protected addEndTime(end: number) {
    if (this.#frozen === true) {
      throw Error('Should not modify endtime of a frozen node');
    }
    // console.log(`${this.name} add end ${this.lifespan.end}->${end} `)
    if (this.lifespan.end > end) {
      throw Error('Should not shorten the lifespan of nodes');
    }
    this.lifespan.end = end;
    this.reportEndTimeToParent();
  }

  // enlarge Parent's lifespan based on children's
  reportEndTimeToParent() {
    if (this.parent
      && this.lifespan.end > this.parent.lifespan.end) {
      this.parent.addEndTime(this.lifespan.end);
    }
  }
}
