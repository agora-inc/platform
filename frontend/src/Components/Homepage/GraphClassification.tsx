import React, { Component } from "react";
import Tree from 'react-d3-tree';
import { Graph } from "react-d3-graph";


// graph payload (with minimalist structure)
const data = {
    nodes: [{ id: "Mathematics" }, { id: "Probability" }, { id: "Stochastic Calculus" },
            { id: "Random Graphs"}, { id: "Combinatorics"} ],
    links: [
        { source: "Mathematics", target: "Probability" },
        { source: "Mathematics", target: "Combinatorics" },
        { source: "Probability", target: "Stochastic Calculus" },
        { source: "Probability", target: "Random Graphs" },

    ],
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: "lightgreen",
        size: 120,
        highlightStrokeColor: "blue",
    },
    link: {
        highlightColor: "lightblue",
    },
    collapsable: true
};

export default class GraphClassification extends React.Component {

  // graph event callbacks
  onClickGraph = () => {
    window.alert(`Clicked the graph background`);
  };

  onClickNode = (nodeId: string) => {
    window.alert(`Clicked node ${nodeId}`);
  };

  onDoubleClickNode = (nodeId: string) => {
    window.alert(`Double clicked node ${nodeId}`);
  };

  onRightClickNode = (e: any, nodeId: string) => {
    window.alert(`Right clicked node ${nodeId}`);
  };

  onMouseOverNode = (nodeId: string) => {
    window.alert(`Mouse over node ${nodeId}`);
  };

  onMouseOutNode = (nodeId: string) => {
    window.alert(`Mouse out node ${nodeId}`);
  };

  onClickLink = (source: string, target: string) => {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  onRightClickLink = (e: any, source: string, target: string) => {
    window.alert(`Right clicked link between ${source} and ${target}`);
  };

  onMouseOverLink = (source: string, target: string) => {
    window.alert(`Mouse over in link between ${source} and ${target}`);
  };

  onMouseOutLink = (source: string, target: string) => {
    window.alert(`Mouse out link between ${source} and ${target}`);
  };

  onNodePositionChange = (nodeId: string, x: number, y: number) => {
    window.alert(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
  };

  render() {
    return (
      <div id="graphWrapper" style={{width: '50em', height: '25em'}}>
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={myConfig}
          onClickNode={this.onClickNode}
          onDoubleClickNode={this.onDoubleClickNode}
          onRightClickNode={this.onRightClickNode}
          onClickGraph={this.onClickGraph}
          onClickLink={this.onClickLink}
          onRightClickLink={this.onRightClickLink}
          onMouseOverNode={this.onMouseOverNode}
          onMouseOutNode={this.onMouseOutNode}
          onMouseOverLink={this.onMouseOverLink}
          onMouseOutLink={this.onMouseOutLink}
          onNodePositionChange={this.onNodePositionChange}
        />;
      </div>
    );
  }
}




