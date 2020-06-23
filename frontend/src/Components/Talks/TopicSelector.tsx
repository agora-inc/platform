import React, { Component } from "react";
import { Box, Select } from "grommet";
import { Topic, TopicService } from "../../Services/TopicService";
// import allTopics from "../../assets/allTopics.json"
import Button from "../Core/Button";

interface State {
  all: Topic[],
  topics: Topic[][];
  topicsBeingShown: number[];
  numberTopicsChosen: number;
}

interface Props {
  onSelectedCallback: any
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
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ all: allTopics });
    });
  }

  onClickAddTopic = () => {
    this.setState((state) => ({
      numberTopicsChosen: state.numberTopicsChosen + 1,
    }));
  };

  onFieldChoose = (choiceNumber: number, topic: Topic, fieldDepth: number) => {
    let tempBools = this.state.topicsBeingShown;

    if (topic.id >= 0) {
      tempBools[choiceNumber] = fieldDepth + 1;
      this.props.onSelectedCallback(topic, choiceNumber);
    } else {
      tempBools[choiceNumber] = fieldDepth;
      
    }

    let tempTopics = this.state.topics;
    tempTopics[choiceNumber] = tempTopics[choiceNumber].slice(0, fieldDepth);
    tempTopics[choiceNumber].push(topic);
    this.setState({
      topics: tempTopics,
      topicsBeingShown: tempBools,
    });
  };

  nameToTopic = (name: string): Topic => {
    if (name == "-") {
      return {field: "-",
              id: -1,
              is_primitive_node: false,
              parent_1_id: -1,
              parent_2_id: -1, 
              parent_3_id: -1}
    } else {
      return this.state.all
        .filter(function (topic: Topic) {
          return topic.field === name;
        })
        .map((topic: Topic) => topic)[0];
    }
  };

  /*
  nameToId = (name: string) => {
    if (name == "-") {
      return -1;
    } else {
      return this.state.all
        .filter(function (topic: any) {
          return topic.field === name;
        })
        .map((topic: any) => topic.id)[0];
    }
  };
  */

  getPrimitiveNodes = () => {
    return this.state.all
      .filter(function (topic: Topic) {
        return topic.is_primitive_node;
      })
      .map((topic: Topic) => topic.field);
  };

  getChildren = (topic: Topic) => {
    return this.state.all
      .filter(function (temp: Topic) {
        return (
          temp.parent_1_id == topic.id ||
          temp.parent_2_id == topic.id ||
          temp.parent_3_id == topic.id
        );
      })
      .map((temp: Topic) => temp.field);
  };

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
              onChange={({ option }) =>
                this.onFieldChoose(choiceNumber, this.nameToTopic(option), 0)
              }
            />
          )}
          {this.state.topicsBeingShown[choiceNumber] >= 1 && (
            <Select
              options={this.getChildren(
                this.state.topics[choiceNumber][0]
              ).concat("-")}
              onChange={({ option }) =>
                this.onFieldChoose(choiceNumber, this.nameToTopic(option), 1)
              }
            />
          )}
          {this.state.topicsBeingShown[choiceNumber] >= 2 && (
            <Select
              options={this.getChildren(
                this.state.topics[choiceNumber][1]
              ).concat("-")}
              onChange={({ option }) =>
                this.onFieldChoose(choiceNumber, this.nameToTopic(option), 2)
              }
            />
          )}
        </Box>
      );
    } else if (choiceNumber == this.state.numberTopicsChosen + 1) {
      return (
        <Button
          width={"10"}
          height={"10"}
          onClick={this.onClickAddTopic}
          text={"Add topic"}
        />
      );
    }
  };

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
