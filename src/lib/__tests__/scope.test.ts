import { LifeSpan, VisNode } from '../scope';

test('lifespan creation', () => {
  const x: LifeSpan = { start: 3, end: 6.7 };
  expect(x.start).toBe(3);
  expect(x.end).toBe(6.7);
});

test('VisScope creation', () => {
  const s = new VisNode('aaba', 'task', 3);
  expect(s.name).toBe('aaba');
  expect(s.lifespan.start).toBe(3);
  expect(s.lifespan.end).toBe(3);
});

test('VisScope add children', () => {
  const p = new VisNode('parent', 'scope', 2);
  const c = new VisNode('child', 'task', 2);
  p.addChildren(c);
  c.end(4);
  expect(c.lifespan.end).toBe(4);
});

test('VisScope test invalid child', () => {
  const p = new VisNode('parent', 'scope', 2);
  const c = new VisNode('child', 'task', 1);
  expect(() => {
    p.addChildren(c);
  }).toThrowError();
});

test('VisScope test invalid parent', () => {
  const p = new VisNode('parent', 'task', 2);
  const c = new VisNode('child', 'task', 1);
  expect(() => {
    p.addChildren(c);
  }).toThrowError();
});
