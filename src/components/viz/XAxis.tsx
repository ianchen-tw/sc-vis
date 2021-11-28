import { max } from 'd3-array';

type LinearTick = {
  tickValue: number;
  pos: number
}

type xAxisProps = {
  ticks: LinearTick[];
  height: number;
};

const XAxis = (props: xAxisProps) => {
  const { ticks, height } = props;
  const maxPos = max(ticks.map((t) => t.pos)) ?? 0;
  const labelYShift = 5;
  const timeAxisLabelShift = 25;

  const axis = ticks.map((t) => (
    <g key={`tick-${t.tickValue}`} transform={`translate(${t.pos},0)`}>
      <line
        y2={height}
        stroke="black"
        strokeDasharray="4, 7"
        style={{
          strokeOpacity: 0.2,
        }}
      />
      <text style={{ textAnchor: 'middle' }} dy=".71em" y={height + labelYShift}>{t.tickValue}</text>
    </g>
  ));
  return (
    <>
      {axis}
      <text dy=".71em" y={height + labelYShift} transform={`translate(${maxPos + timeAxisLabelShift},0)`}>Time</text>
    </>
  );
};

export default XAxis;
