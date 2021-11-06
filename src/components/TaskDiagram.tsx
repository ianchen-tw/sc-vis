import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { VisNode } from '../lib/scope';
import ScopeArea from './viz/ScopeArea';
import { reorderByScopes } from '../lib/layout';

const margin = {
  top: 20, right: 100, bottom: 20, left: 20,
};

type TaskDiagramProps = {
  width?: number;
  height?: number;
  scopeTree: VisNode;
}

const TaskDiagram = (props: TaskDiagramProps) => {
  const { width = 600, height = 400, scopeTree } = props;

  // const { tasks, scope_ranges } = reorder_by_scopes(data, scopes)
  const { tasks, scopeResults } = reorderByScopes(scopeTree);

  const maxEndTime = max(tasks.map((t) => t.lifespan.end ?? 0)) ?? 0;

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  // scale
  const xScale = scaleLinear()
    .domain([0, maxEndTime])
    .range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(tasks.map((d) => d.name))
    .range([0, innerHeight])
    .paddingInner(0.5)
    .paddingOuter(0.5);

  const scopeAreas = scopeResults.map((result) => {
    const x = xScale(result.scope.lifespan.start);
    const y = yScale(result.startTask) ?? 0 - yScale.bandwidth() * 0.2;
    const wid = xScale(result.scope.lifespan.end - result.scope.lifespan.start);
    const hei = (yScale(result.endTask) ?? 1) - (yScale(result.startTask) ?? 0)
      + yScale.bandwidth() * 1.4;
    return (
      <g transform={`translate(${x},${y})`}>
        <ScopeArea
          width={wid}
          height={hei}
          name={result.scope.name}
        />
      </g>
    );
  });

  return (
    <svg
      className="border-2 border-gray-300"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        {xScale.ticks().map((tickValue) => (
          <g key={`tick-${tickValue}`} transform={`translate(${xScale(tickValue)},0)`}>
            <line
              y2={innerHeight}
              stroke="black"
              style={{
                strokeOpacity: 0.2,
              }}
            />
            <text style={{ textAnchor: 'middle' }} dy=".71em" y={innerHeight + 5}>{tickValue}</text>
          </g>
        ))}
        {scopeAreas}
      </g>

    </svg>
  );
};

export default TaskDiagram;
