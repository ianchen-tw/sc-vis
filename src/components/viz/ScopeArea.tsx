const areaStyle = {
  strokeOpacity: 0.3,
};

type ScopeAreaProps = {
  width: number
  height: number
}

const ScopeArea = (props: ScopeAreaProps) => {
  const { width, height } = props;
  return (
    <g>
      <rect
        fill="None"
        stroke="#2460A7FF"
        strokeWidth="2"
        width={width}
        height={height}
        style={areaStyle}
      />
      {/* <text x="-15" y="15">
        .
      </text> */}
    </g>
  );
};

export default ScopeArea;
