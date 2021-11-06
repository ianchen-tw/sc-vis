const style = {
  fill: '#F2DA57',
};

const nameStyle = {
  fill: '#0F8C79',
};

type TaskLifeTimeProps = {
  width: number
  outerHeight: number
  name: string
}
const TaskLifeTime = (props: TaskLifeTimeProps) => {
  const { width, outerHeight, name } = props;
  const innerHeight = outerHeight * 0.8;
  const yOffset = outerHeight * 0.2;

  return (
    <g transform={`translate(0,${yOffset})`}>
      <rect
        width={width}
        height={innerHeight}
        style={style}
      />
      <text style={nameStyle} transform={`translate(5,${outerHeight * 0.6})`}>
        {name}
      </text>
    </g>
  );
};

export default TaskLifeTime;
