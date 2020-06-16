import React, { Component } from "react";
import { Box, Select } from "grommet";
import { Topic, TreeTopics, TopicService } from "../../Services/TopicService"
import allTopics from "../../assets/allTopics.json"


interface State {
  all: any, // Topic[],
  topics: number[][],
  topicsBeingShown: boolean[][],
}

interface Props {

}

export default class TopicSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      all: [],
      topics: [[], [], []],
      topicsBeingShown: [[true], [true], [true]],
    };
  }

  componentWillMount() {
    /*
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ all: allTopics });
    });
    */
    this.setState({all: allTopics})
  }

  onFieldChoose = (choiceNumber: number, id: number, fieldDepth: number) => {
    let tempBools = this.state.topicsBeingShown;

    if (id >= 0) {
      tempBools[choiceNumber].push(true);
      // tempBools[topicNumber].slice(fieldDepth+2) = false;
    } else {
      tempBools[choiceNumber].push(true);
      // tempBools[topicNumber].slice(fieldDepth+1) = false;
    }
    
    let tempTopics = this.state.topics;
    tempTopics[choiceNumber].push(id);
    this.setState({
      topics: tempTopics,
      topicsBeingShown: tempBools
    })
    console.log(this.state)
  }
  
  nameToId = (name: string) => {
    console.log("name", name)
    console.log(this.state.all.filter(function(topic: any) {
      return topic.field === name;
    }))
    return(
      this.state.all.filter(function(topic: any) {
        return topic.field === name;
      }).map((topic: any) => topic.id)
    );
  }

  getPrimitiveNodes = () => {
    return(
      this.state.all.filter(function(topic: any) {
        return topic.is_primitive_node;
      }).map((topic: any) => topic.field)
    );
  }

  getChildren = (id: number)  => {
    console.log("id", id)
    console.log(this.state.all.filter(function(topic: any) {
      return topic.parent_1_id == id || topic.parent_2_id == id || topic.parent_3_id == id ;
    }))
    return(
      this.state.all.filter(function(topic: any) {
        return topic.parent_1_id == id || topic.parent_2_id == id || topic.parent_3_id == id ;
      }).map((topic: any) => topic.field)
    );
  }

  render() {
    return (
      <Box
        width="100%"
        direction="row"
        gap="xsmall"
        align="end"
        margin={{ bottom: "15px" }}
      >
        <Select
          options={this.getPrimitiveNodes()}
          onChange={({option}) => this.onFieldChoose(0, this.nameToId(option)[0], 0)}
        />
        {this.state.topicsBeingShown[0][1] && (
          <Select
            options={this.getChildren(this.state.topics[0][0])}
            onChange={({option}) => this.onFieldChoose(0, this.nameToId(option)[0], 1)}
          />
        )}
        {this.state.topicsBeingShown[0][2] && (
          <Select
            options={this.getChildren(this.state.topics[0][1])}
            onChange={({option}) => this.onFieldChoose(0, this.nameToId(option)[0], 2)}
          />
        )}
      </Box>
    );
  }
}
