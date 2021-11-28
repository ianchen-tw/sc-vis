import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { VisNode } from '../lib/scopeTree';
import ScopeArea from './viz/ScopeArea';
import { renderLayout } from '../lib/render';
import XAxis from './viz/XAxis';
import TaskLifeTime from './viz/TaskLifeTime';
import { LogConfig } from '../lib/validate';

const margin = {
  top: 20, right: 100, bottom: 20, left: 20,
};

type TaskDiagramProps = {
  width?: number;
  height?: number;
  scopeTree: VisNode;
  visConfig: LogConfig;
}

const TaskDiagram = (props: TaskDiagramProps) => {
  const {
    width = 600, height = 400, scopeTree, visConfig,
  } = props;

  const { tasks, scopeResults } = renderLayout(scopeTree, visConfig);

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
        // name={result.scope.name}
        />
      </g>
    );
  });

  const taskLifeTimes = tasks.map((task) => {
    const x = xScale(task.lifespan.start);
    const y = yScale(task.name) ?? 0;
    const wid = xScale(((task.lifespan.end ?? task.lifespan.start) - task.lifespan.start));
    const hei = yScale.bandwidth();
    return (
      <g transform={`translate(${x},${y})`}>
        <TaskLifeTime
          width={wid}
          outerHeight={hei}
          name={task.name}
        />
      </g>
    );
  });

  const xTicks = xScale.ticks().map((tickValue) => ({
    tickValue, pos: xScale(tickValue),
  }));

  return (
    <svg
      className="border-2 border-gray-300"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <XAxis
          ticks={xTicks}
          height={innerHeight}
        />
        {scopeAreas}
        {taskLifeTimes}
      </g>
    </svg>
  );
};

export default TaskDiagram;
