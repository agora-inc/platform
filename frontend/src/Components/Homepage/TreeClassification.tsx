import React, { Component } from "react";
import { Tree } from 'react-d3-tree';
import treeData from "../../assets/tree.json"
import { TopicService, TreeTopic } from "../../Services/TopicService"


/*
const myTreeData = [
  {
    name: 'Mathematics',
    attribute: {leaf: false},
    nodeSvgShape: {
      shape: 'rect',
      shapeProps: {
        width: 20,
        height: 20,
        fill: 'red',
      },
    },
    children: [
      {
        name: 'Algebra',
        attribute: {leaf: false},
        _collapsed: true,
        children: [
          {name: 'Symplectic geometry',
          attribute: {leaf: true}},
          {name: 'Rings and Algebras',
          attribute: {leaf: true}},
          {name: 'Representation theory',
          attribute: {leaf: true}},
          {name: 'Algebraic geometry',
          attribute: {leaf: true}},
          {name: 'Commutative algebra',
          attribute: {leaf: true}},
          {name: 'Operator algebras',
          attribute: {leaf: true}},
          {name: 'Algebraic topology',
          attribute: {leaf: true}},
        ]
      },
      {name: 'Geometry',
      attribute: {leaf: true}},
      {name: 'Foundational',
      attribute: {leaf: true}},
      {name: 'Combinatorics',
      attribute: {leaf: true}},
      {name: 'Topology',
      attribute: {leaf: true}},
      {name: 'Statistics',
      attribute: {leaf: true}},
      {name: 'Analysis',
      attribute: {leaf: true}},
      {name: 'Mathematical modelling',
      attribute: {leaf: true}},
      {name: 'Numerical analysis',
      attribute: {leaf: true}},
      {name: 'Probability',
      attribute: {leaf: true},
      _collapsed: true,
        children : [
          {name: 'Stochastic calculus',
           attribute: {leaf: true},
           nodeSvgShape: {
            shape: 'circle',
            shapeProps: {
              r: 10,
              fill: 'red'
            },
           },
          },
          {name: "Random graphs",
           attribute: {leaf: true}},
          {name: "Rough path theory",
          attribute: {leaf: true}},
          {name: "Foundations of probability theory",
          attribute: {leaf: true}},
          {name: "SDE and SPDEs",
          attribute: {leaf: true}},
          {name: "Stochastic control theory",
          attribute: {leaf: true}},
          {name: "Percolation theory",
          attribute: {leaf: true}},
        ]
      },
    ],
  },
];
*/

/*
interface Props {
  className: string
  nodeData: any
}


class NodeLabel extends React.PureComponent<Props> {
  render() {
    return (
      <div className={this.props.className}>
        <h2>{this.props.nodeData.name}</h2>
      </div>
    )
  }
}
*/

let configStyles = {
  links: {
    fill:"none",
    stroke: "#222",
    strokeWidth: "2px",
    strokeDasharray:"2,2"
  },
}


interface State {
  data: any
}

export default class TreeClassification extends React.Component<{}, State> {
  
  componentWillMount() {
    /*
    TopicService.getDataTreeStructure((treeData: any) => {
      console.log("Tch bon")
      console.log(treeData)
      this.setState({ data: treeData });
    });
    */
   this.setState({data: treeData})
  }

  pathFunc = (linkData: any, orientation: string) => {
    const { source, target } = linkData;
    return 0;
  }

  nodeOnClick = (nodeData: any, e: any) => {
    let temp = this.state.data;    
  }

  render() {
    return (
      <div id="treeWrapper" style={{width: '200em', height: '50em'}}>
        <Tree 
          data={this.state.data} 
          translate={{y: 100, x:400}} 
          orientation={"horizontal"}
          separation={{siblings: 0.3, nonSiblings: 0.2}}
          
          allowForeignObjects
          onClick={this.nodeOnClick}
          useCollapseData={true}
          shouldCollapseNeighborNodes={true}
          depthFactor={250}
        />
      </div>
    );
  }
}

/*
styles={configStyles}
*/