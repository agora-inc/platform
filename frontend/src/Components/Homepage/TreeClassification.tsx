import React, { Component } from "react";
import Tree from 'react-d3-tree';


const myTreeData = [
  {
    name: 'Mathematics',
    attributes: {
      keyA: 'val A',
    },
    children: [
      {
        name: 'Graph theory',
        attributes: {
          keyA: 'val A',
          keyB: 'val B',
          keyC: 'val C',
        },
      },
      {
        name: 'Combinatorics',
        children : [
          {
            name: 'Ramsey theory',
          },
          {
            name: "Pigeonhole principle"
          }
        ]
      },
    ],
  },
];

export default class TreeClassification extends React.Component {
  render() {
    return (
      <div id="treeWrapper" style={{width: '100em', height: '50em'}}>
        <Tree data={myTreeData} translate={{y: 200, x:100}} orientation={'vertical'}/>
      </div>
    );
  }
}