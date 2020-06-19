import React, { Component } from "react";
import { Box, Select } from "grommet";
import { Topic, TopicService } from "../../Services/TopicService"
import allTopics from "../../assets/allTopics.json"
import Button from "../Core/Button";


interface State {
  all: any, // Topic[],
  topics: number[][],
  topicsBeingShown: number[],
  numberTopicsChosen: number
}

interface Props {
  onSelectedTopicCallback: any
}

export default class TopicSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      all: [],
      topics: [[], [], []],
      topicsBeingShown: [0, 0, 0],
      numberTopicsChosen: -1,
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

  onClickAddTopic = () => {
    this.setState((state) => ({
      numberTopicsChosen: state.numberTopicsChosen + 1 
    }));
  }

  onFieldChoose = (choiceNumber: number, id: number, fieldDepth: number) => {
    let tempBools = this.state.topicsBeingShown;

    if (id >= 0) {
      tempBools[choiceNumber] = fieldDepth+1;    
    } else {
      tempBools[choiceNumber] = fieldDepth;
    }   
    
    let tempTopics = this.state.topics;
    tempTopics[choiceNumber] = tempTopics[choiceNumber].slice(0, fieldDepth)
    tempTopics[choiceNumber].push(id);
    this.setState({
      topics: tempTopics,
      topicsBeingShown: tempBools
    })
  }
  
  nameToId = (name: string) => {
    if (name == "-") {
      return -1
    } else {
      return(
        this.state.all.filter(function(topic: any) {
          return topic.field === name;
        }).map((topic: any) => topic.id)[0]
      )
    }
  }

  getPrimitiveNodes = () => {
    return(
      this.state.all.filter(function(topic: any) {
        return topic.is_primitive_node;
      }).map((topic: any) => topic.field)
    );
  }

  getChildren = (id: number) => {
    return(
      this.state.all.filter(function(topic: any) {
        return topic.parent_1_id == id || topic.parent_2_id == id || topic.parent_3_id == id ;
      }).map((topic: any) => topic.field)
    );
  }

  renderTopicChoice = (choiceNumber: number) => {
    if (choiceNumber <= this.state.numberTopicsChosen) {
      return (
        <Box
            width="100%"
            direction="row"
            gap="xsmall"
            align="end"
            margin={{ bottom: "15px" }}
          >
            {this.state.topicsBeingShown[choiceNumber] >= 0 && (
              <Select
                options={this.getPrimitiveNodes().concat("-")}
                onChange={({option}) => this.onFieldChoose(choiceNumber, this.nameToId(option), 0)}
              />
            )}
            {this.state.topicsBeingShown[choiceNumber] >= 1 && (
              <Select
                options={this.getChildren(this.state.topics[choiceNumber][0]).concat("-")}
                onChange={({option}) => this.onFieldChoose(choiceNumber, this.nameToId(option), 1)}
              />
            )}
            {this.state.topicsBeingShown[choiceNumber] >= 2 && (
              <Select
                options={this.getChildren(this.state.topics[choiceNumber][1]).concat("-")}
                onChange={({option}) => this.onFieldChoose(choiceNumber, this.nameToId(option), 2)}
              />
            )}
        </Box>
      )
    } else if (choiceNumber == this.state.numberTopicsChosen+1) {
      return (
        <Button
          width={"10"}
          height={"10"}
          onClick={this.onClickAddTopic}
          text={"Add topic"}
        />
      )
    }
  }

  render() {
    return (
      <Box width="100%" direction="column">
        {this.renderTopicChoice(0)}
        {this.renderTopicChoice(1)}
        {this.renderTopicChoice(2)} 
      </Box>  
    );
  }
}