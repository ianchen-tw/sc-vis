const areaStyle = {
  strokeOpacity: 0.35,
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
        stroke="black"
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
