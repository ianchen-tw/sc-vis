class ScopeHistory {
  constructor(id, start, parent) {
    this.id = id
    this.lifespan = {
      start: start,
      end: null,
    }

    // Location used for rendering
    // a scope would generate two nodes on the visualization process
    this.loc = {
      col: null,
    }
    this.children = []
    this.parent = null

    this.addParent(parent)
  }

  addParent(parent) {
    if (parent === null) {
      return
    }
    if (parent.lifespan.start <= this.lifespan.start) {
      this.parent = parent
      this.parent.children.push(this)
      this.reportEndTimeToParent()
    } else {
      throw Error(
        "Cannot add child start earlier than parent, ",
        `child_start: ${this.lifespan.start}`,
        `parent_start: ${parent.lifespan.start}`
      )
    }
  }

  // Parent's lifespan must contain child's
  reportEndTimeToParent() {
    if (this.lifespan.end !== null && this.parent !== null) {
      this.parent.addEndTime(this.lifespan.end)
    }
  }

  addEndTime(end) {
    if (end > this.lifespan.end || this.lifespan.end === null) {
      console.log(
        `update end time of ${this.id} from ${this.lifespan.end} to ${end}`
      )
      this.lifespan.end = end
    }
    this.reportEndTimeToParent()
  }
  export() {
    let arr = []
    this.children.forEach((c) => {
      arr.push(c.export())
    })
    return {
      id: this.id,
      start: this.lifespan.start,
      end: this.lifespan.end,
      loc: this.loc,
      children: arr,
    }
  }
}

export const Scope = (id, start, parent = null) => {
  let s = new ScopeHistory(id, start, parent)
  return s
}
