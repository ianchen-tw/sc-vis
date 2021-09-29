import React, { useRef, useEffect } from "react"
import { scaleLinear } from "d3-scale"
import { max } from "d3-array"
import { select } from "d3-selection"
import PropTypes from "prop-types"

const BarChart = ({ size, data }) => {
  const d3Container = useRef(null)
  useEffect(() => {
    const svg = select(d3Container.current)
    const dataMax = max(data)
    const yScale = scaleLinear().domain([0, dataMax]).range([0, size[1]])

    const update = svg.append("g").selectAll("rect").data(data)

    update
      .enter()
      .append("rect")
      .style("fill", "#fe9922")
      .attr("x", (d, i) => i * 25)
      .attr("y", (d) => size[1] - yScale(d))
      .attr("height", (d) => yScale(d))
      .attr("width", 25)

    update.exit().remove()
  }, [size, data])
  return (
    <svg
      className="d3-component"
      width={500}
      height={500}
      ref={d3Container}
    ></svg>
  )
}

BarChart.propTypes = {
  size: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.arrayOf(PropTypes.number),
}

export default BarChart
