import { LifeSpan, VisScope } from "./scope"

test("lifespan creation", () => {
    const x: LifeSpan = { start: 3, end: 6.7 }
    expect(x.start).toBe(3);
    expect(x.end).toBe(6.7);
})


test("VisScope creation", () => {
    const s = new VisScope("aaba", 3)
    expect(s.id).toBe("aaba")
    expect(s.lifespan.start).toBe(3)
    expect(s.lifespan.end).toBe(undefined)
})


test("VisScope add children", () => {
    const p = new VisScope("parent", 2)
    const c = new VisScope("child", 2)
    p.addChildren(c)
    c.addEndTime(4)
    expect(c.lifespan.end).toBe(4)
})

test("VisScope test invalid child", () => {
    const p = new VisScope("parent", 2)
    const c = new VisScope("child", 1)
    expect(() => {
        p.addChildren(c)
    }).toThrowError()
})