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
  const axis = ticks.map((t) => (
    <g key={`tick-${t.tickValue}`} transform={`translate(${t.pos},0)`}>
      <line
        y2={height}
        stroke="black"
        style={{
          strokeOpacity: 0.2,
        }}
      />
      <text style={{ textAnchor: 'middle' }} dy=".71em" y={height + 5}>{t.tickValue}</text>
    </g>
  ));
  return <>{axis}</>;
};

export default XAxis;
