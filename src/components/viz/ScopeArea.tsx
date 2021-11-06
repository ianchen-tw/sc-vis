type ScopeAreaProps = {
  width: number
  height: number
  name: string
}

const ScopeArea = (props: ScopeAreaProps) => {
  const { width, height, name } = props;
  return (
    <g>
      <rect
        fill="None"
        stroke="black"
        strokeWidth="2"
        width={width}
        height={height}
      />
      <text x="-15" y="15">
        {name}
      </text>
    </g>
  );
};

export default ScopeArea;
