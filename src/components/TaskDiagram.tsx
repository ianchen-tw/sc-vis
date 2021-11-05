import { useRef, useEffect } from 'react';
import { max } from 'd3-array';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisLeft, axisTop } from 'd3-axis';
import { HierarchyNode, hierarchy } from 'd3-hierarchy';
import { VisNode } from '../lib/scope';
import { NAME_ROOT_SCOPE } from '../lib/runRecord';

interface ScopeResult {
  startTask: string;
  endTask: string;
  scope: VisNode;
}

interface ScopeRange {
  startRow: number;
  endRow: number;
}

interface ReorderResult {
  tasks: VisNode[];
  scopeResults: ScopeResult[]
}

const reorderByScopes = (scopeTree: VisNode): ReorderResult => {
  const root = hierarchy<VisNode>(scopeTree);

  root.sum((d) => (d.type === 'task' ? 1 : 0))
    .sort((a, b) => a.data.lifespan.start - b.data.lifespan.start);

  const taskResult: VisNode[] = [];
  const scopeTable = new Map<VisNode, ScopeRange>();

  // node.value: number of task node under this scope
  const dfsScope = (node: HierarchyNode<VisNode>, startRow: number) => {
    if (node.data.type === 'task') {
      throw Error('Should not call this func with task');
    }
    if (node.children === undefined) {
      // Scope with no tasks
      return;
    }

    // current amount of allocated tasks in layout
    let curRow = startRow;
    node.children.forEach((childNode) => {
      switch (childNode.data.type) {
        case 'task':
          taskResult.push(childNode.data);
          break;
        case 'scope':
          dfsScope(childNode, curRow);
          break;
      }
      curRow += childNode.value ?? 0;
    });

    const nmTasksUnderScope = node.value ?? 0;
    const range: ScopeRange = { startRow, endRow: startRow + nmTasksUnderScope - 1 };
    const visScope: VisNode = node.data;

    // Do not show root scope (only used in building trees)
    if (visScope.name !== NAME_ROOT_SCOPE) {
      scopeTable.set(visScope, range);
    }
  };
  dfsScope(root, 0);
  // console.log("scope_table", scope_table)
  // console.log(task_result)
  const scopeResults: ScopeResult[] = [];
  scopeTable.forEach((range: ScopeRange, scope: VisNode) => {
    const firstTask = taskResult[range.startRow];
    const lastTask = taskResult[range.endRow];

    scopeResults.push({
      startTask: firstTask.name,
      endTask: lastTask.name,
      scope,
    });
  });
  return { tasks: taskResult, scopeResults };
};

type TaskDiagramProps = {
  width?: number;
  height?: number;
  scopeTree: VisNode;
}
const TaskDiagram = (props: TaskDiagramProps) => {
  const { width = 600, height = 400, scopeTree } = props;
  const d3Container = useRef(null);
  const padx = 100;
  const pady = 20;

  // console.log('tree', props.scopeTree);

  useEffect(() => {
    // const { tasks, scope_ranges } = reorder_by_scopes(data, scopes)
    const { tasks, scopeResults } = reorderByScopes(scopeTree);

    const maxEndTime = max(tasks.map((t) => t.lifespan.end ?? 0)) ?? 0;
    const svg = select(d3Container.current);
    svg.selectAll('*').remove();

    // scale
    const xScale = scaleLinear()
      .domain([0, maxEndTime])
      .range([0, width - 2 * padx]);

    const yScale = scaleBand()
      .domain(tasks.map((d) => d.name))
      .range([0, height - pady])
      .paddingInner(0.5)
      .paddingOuter(0.5);

    // axis
    svg
      .append('g')
      .call(axisTop<number>(xScale))
      .attr('transform', `translate(${padx}, ${pady})`);
    svg
      .append('g')
      .call(axisLeft<string>(yScale))
      .attr('transform', `translate(${padx}, ${pady})`);

    // scope data
    const scopeRects = svg.append('g').selectAll('rect').data(scopeResults);
    scopeRects.exit().remove();
    scopeRects
      .enter()
      .append('rect')
      .style('fill', 'None')
      .attr('stroke', 'black')
      .attr('stroke-width', '2')
      .attr('x', (d) => xScale(d.scope.lifespan.start))
      .attr('y', (d) => yScale(d.startTask) ?? 0 - yScale.bandwidth() * 0.2)
      .attr(
        'height',
        (d) => (yScale(d.endTask) ?? 1) - (yScale(d.startTask) ?? 0) + yScale.bandwidth() * 1.4,
      )
      .attr('width', (d) => xScale(d.scope.lifespan.end - d.scope.lifespan.start))
      .attr('transform', `translate(${padx}, ${pady})`);

    // scope label
    const scopeLabels = svg.append('g').selectAll('text').data(scopeResults);
    scopeLabels.exit().remove();
    scopeLabels
      .enter()
      .append('text')
      .text((d) => d.scope.name)
      .attr('x', (d) => xScale(d.scope.lifespan.start))
      .attr('y', (d) => (yScale(d.startTask) ?? 0) - yScale.bandwidth() * 0.2)
      .attr('transform', `translate(${padx}, ${pady})`);

    // task data
    const bars = svg.append('g').selectAll('rect').data(tasks);
    bars.exit().remove();

    bars.enter()
      .append('rect')
      .style('fill', '#fe9922')
      .attr('x', (d) => xScale(d.lifespan.start))
      .attr('y', (d) => yScale(d.name) ?? 0)
      .attr('height', yScale.bandwidth())
      .attr('width', (d) => xScale((d.lifespan.end ?? d.lifespan.start) - d.lifespan.start))
      .attr('transform', `translate(${padx}, ${pady})`);
  }, [width, height, scopeTree]);

  return (
    <svg
      className="border-2 border-gray-300"
      width={width}
      height={height}
      ref={d3Container}
    />
  );
};

export default TaskDiagram;
