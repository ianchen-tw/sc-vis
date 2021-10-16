import React, { useRef, useEffect, useState } from "react"
import { max, min, group } from "d3-array"
import { select } from "d3-selection"
import { scaleLinear, scaleBand } from "d3-scale"
import { axisBottom, axisLeft, axisTop } from "d3-axis"
import PropTypes, { node } from "prop-types"
import { stratify } from "d3-hierarchy"
import { sort, inPlaceSort } from "fast-sort"
import scope from "postcss-modules-scope"

const Node = (type, data) => {
  return {
    type: type,
    ...data,
  }
}

const Scope = (name, start, end, parent = "_") => {
  return Node("scope", {
    name: name,
    start: start,
    end: end,
    parent: parent,
  })
}

const Task = (name, start, end, parent = "_") => {
  return Node("task", {
    name: name,
    start: start,
    end: end,
    parent: parent,
  })
}

const scopes = [
  Scope("_", 0, 11, null),
  Scope("A", 0, 10),
  Scope("B", 2, 7, "A"),
  Scope("C", 4, 11),
]

const data = [
  Task("task3", 5, 9, "C"),
  Task("task4", 6, 11, "C"),
  Task("task1", 1, 8, "A"),
  Task("task2", 2, 7, "B"),
]

const reorder_by_scoeps = (tasks, scopes) => {
  const all = [...tasks, ...scopes]
  // make nodes into a hierarchical tree
  const root = stratify()
    .id((dta) => dta.name)
    .parentId((dta) => dta.parent)(all)

  root
    .sum((data) => (data.type === "task" ? 1 : 0))
    .sort((a, b) => a.data.start - b.data.start)

  let task_result = []
  let scope_table = new Map()

  let dfs_scope = (node, start) => {
    let local_cnt = start
    node.children.forEach((childNode) => {
      switch (childNode.data.type) {
        case "task":
          task_result.push(childNode.data)
          break
        case "scope":
          dfs_scope(childNode, local_cnt)
          break
      }
      local_cnt += childNode.value
    })
    scope_table.set(node.data, [start, start + node.value - 1])
  }
  dfs_scope(root, 0)
  let scope_result = []
  scope_table.forEach((val, scope) => {
    scope_result.push({
      start_task: task_result[val[0]].name,
      end_task: task_result[val[1]].name,
      start_time: scope.start,
      end_time: scope.end,
      name: scope.name,
    })
  })
  console.log(scope_result)
  return { tasks: task_result, scope_ranges: scope_result }
}

const TaskDiagram = ({ size }) => {
  const { width, height } = size
  // const [tasks, setTasks] = useState(data)
  const d3Container = useRef(null)
  const padx = 50
  const pady = 20

  useEffect(() => {
    // const min_start_time = min(data.map((t) => t.start))

    // const tasks = reorder_by_scoeps(data, scopes)
    const { tasks, scope_ranges } = reorder_by_scoeps(data, scopes)
    // setTasks(_tasks)
    // const tasks = data

    const max_end_time = max(tasks.map((t) => t.end))
    const svg = select(d3Container.current)

    // scale
    const xScale = scaleLinear()
      .domain([0, max_end_time])
      .range([0, width - 2 * padx])

    const yScale = scaleBand()
      .domain(tasks.map((d) => d.name))
      .range([0, height - pady])
      .paddingInner(0.5)
      .paddingOuter(0.5)

    // axis
    svg
      .append("g")
      .call(axisTop().scale(xScale))
      .attr("transform", `translate(${padx}, ${pady})`)
    svg
      .append("g")
      .call(axisLeft().scale(yScale))
      .attr("transform", `translate(${padx}, ${pady})`)

    // scope data
    const scope_rects = svg.append("g").selectAll("rect").data(scope_ranges)
    scope_rects.exit().remove()
    scope_rects
      .enter()
      .append("rect")
      .style("fill", "None")
      .attr("stroke", "black")
      .attr("stroke-width", "2")
      .attr("x", (d) => xScale(d.start_time))
      .attr("y", (d) => yScale(d.start_task) - yScale.bandwidth() * 0.2)
      .attr(
        "height",
        (d) =>
          yScale(d.end_task) - yScale(d.start_task) + yScale.bandwidth() * 1.4
      )
      .attr("width", (d) => xScale(d.end_time - d.start_time))
      .attr("transform", `translate(${padx}, ${pady})`)

    // scope label
    const scope_labels = svg.append("g").selectAll("text").data(scope_ranges)
    scope_labels.exit().remove()
    scope_labels
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("x", (d) => xScale(d.start_time))
      .attr("y", (d) => yScale(d.start_task) - yScale.bandwidth() * 0.2)
      .attr("transform", `translate(${padx}, ${pady})`)

    // task data
    const bars = svg.append("g").selectAll("rect").data(tasks)
    bars.exit().remove()

    bars
      .enter()
      .append("rect")
      .style("fill", "#fe9922")
      .attr("x", (d) => xScale(d.start))
      .attr("y", (d, i) => yScale(d.name))
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.end - d.start))
      .attr("transform", `translate(${padx}, ${pady})`)
  }, [width, height])

  return (
    <svg
      className="border-2 border-gray-300"
      width={width}
      height={height}
      ref={d3Container}
    ></svg>
  )
}

TaskDiagram.propTypes = {
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
}
TaskDiagram.defaultProps = {
  size: {
    width: 500,
    height: 400,
  },
}

export default TaskDiagram
