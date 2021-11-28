const lifetimeRectStyle = {
  fill: '#C7D3D4FF',
};

const nameStyle = {
  fill: '#603F83FF',
};

type TaskLifeTimeProps = {
  width: number
  outerHeight: number
  name: string
}
const TaskLifeTime = (props: TaskLifeTimeProps) => {
  const { width, outerHeight, name } = props;
  const innerHeight = outerHeight * 0.9;
  const yOffset = outerHeight * 0.3;

  return (
    <g transform={`translate(0,${yOffset})`}>
      <rect
        width={width}
        height={innerHeight}
        style={lifetimeRectStyle}
      />
      <text style={nameStyle} transform={`translate(5,${outerHeight * 0.8})`}>
        {name}
      </text>
    </g>
  );
};

export default TaskLifeTime;
