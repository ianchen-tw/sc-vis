import React, { useRef, useEffect } from "react"
import { max } from "d3-array"
import { select } from "d3-selection"
import { scaleLinear, scaleBand } from "d3-scale"
import { axisLeft, axisTop } from "d3-axis"
import { stratify, HierarchyNode } from "d3-hierarchy"


interface Node {
    type: string;
    name: string;
    start: number;
    end: number;
    parent: string | null;
}

function Scope(name: string, start: number, end: number, parent: string | null = "_"): Node {
    // a null parent indicate root
    return {
        type: "scope",
        name: name,
        start: start,
        end: end,
        parent: parent
    }
}

function Task(name: string, start: number, end: number, parent: string = "_"): Node {
    return {
        type: "task",
        name: name,
        start: start,
        end: end,
        parent: parent
    }
}

const scopes: Node[] = [
    Scope("_", 0, 11, null),
    Scope("A", 0, 10),
    Scope("B", 2, 7, "A"),
    Scope("C", 4, 11),
]

const data: Node[] = [
    Task("task3", 5, 9, "C"),
    Task("task4", 6, 11, "C"),
    Task("task1", 1, 8, "A"),
    Task("task2", 2, 7, "B"),
]

interface ScopeResult {
    start_task: string;
    end_task: string;
    start_time: number;
    end_time: number;
    name: string;
}

interface ReorderResult {
    tasks: Node[];
    scope_ranges: ScopeResult[]
}

const reorder_by_scopes = (tasks: Node[], scopes: Node[]): ReorderResult => {
    const all = [...tasks, ...scopes];
    const root = stratify<Node>().id((data: Node) => data.name).parentId((dta: Node) => dta.parent)(all)

    root.sum((d) => (d.type === "task" ? 1 : 0))
        .sort((a, b) => a.data.start - b.data.start)

    let task_result: Node[] = []
    let scope_table = new Map()

    let dfs_scope = (node: HierarchyNode<Node>, start: number) => {
        let local_cnt = start
        node.children?.forEach((childNode) => {
            switch (childNode.data.type) {
                case "task":
                    task_result.push(childNode.data)
                    break
                case "scope":
                    dfs_scope(childNode, local_cnt)
                    break
            }
            local_cnt += childNode.value ?? 0;
        })
        scope_table.set(node.data, [start, start + (node.value ?? 0) - 1])
    }
    dfs_scope(root, 0)
    let scope_result: ScopeResult[] = []
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

type TaskDiagramProps = {
    width?: number;
    height?: number;
}
const TaskDiagram = (props: TaskDiagramProps) => {
    const { width = 500, height = 400 } = props
    const d3Container = useRef(null)
    const padx = 50
    const pady = 20

    useEffect(() => {
        const { tasks, scope_ranges } = reorder_by_scopes(data, scopes)

        const max_end_time = max(tasks.map((t) => t.end)) ?? 0
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
            .call(axisTop<number>(xScale))
            .attr("transform", `translate(${padx}, ${pady})`)
        svg
            .append("g")
            .call(axisLeft<string>(yScale))
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
            .attr("y", (d) => yScale(d.start_task) ?? 0 - yScale.bandwidth() * 0.2)
            .attr(
                "height",
                (d) =>
                    (yScale(d.end_task) ?? 1) - (yScale(d.start_task) ?? 0) + yScale.bandwidth() * 1.4
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
            .attr("y", (d) => (yScale(d.start_task) ?? 0) - yScale.bandwidth() * 0.2)
            .attr("transform", `translate(${padx}, ${pady})`)

        // task data
        const bars = svg.append("g").selectAll("rect").data(tasks)
        bars.exit().remove()

        bars.enter()
            .append("rect")
            .style("fill", "#fe9922")
            .attr("x", (d) => xScale(d.start))
            .attr("y", (d) => yScale(d.name) ?? 0)
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

export default TaskDiagram