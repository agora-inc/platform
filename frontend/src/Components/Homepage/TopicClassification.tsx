import React, { Component } from "react";
import { Box, Select, Text } from "grommet";
import { Topic, TopicService } from "../../Services/TopicService";
// import allTopics from "../../assets/allTopics.json"
import Button from "../Core/Button";


interface Props {
  topicCallback: any
}

interface State {
  data: Topic[],
  topics: Topic[]
  topicBeingShown: number;
}

export default class TopicSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [],
      topics: [],
      topicBeingShown: 0,
    };
  }

  componentWillMount() {
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ data: allTopics });
    });
  }

  onFieldChoose = (topic: Topic, fieldDepth: number) => {
    let temp = 0
    if (topic.id >= 0) {
      temp = fieldDepth + 1
      this.props.topicCallback(topic);
    } else {
      temp = fieldDepth
    }

    let tempTopics = this.state.topics;
    tempTopics = tempTopics.slice(0, fieldDepth);
    tempTopics.push(topic);
    this.setState({
      topics: tempTopics,
      topicBeingShown: temp,
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
      return this.state.data
        .filter(function (topic: Topic) {
          return topic.field === name;
        })
        .map((topic: Topic) => topic)[0];
    }
  };

  getPrimitiveNodes = () => {
    return this.state.data
      .filter(function (topic: any) {
        return topic.is_primitive_node;
      })
      .map((topic: any) => topic.field);
  };

  getChildren = (topic: Topic) => {
    return this.state.data
      .filter(function (temp: Topic) {
        return (
          temp.parent_1_id == topic.id ||
          temp.parent_2_id == topic.id ||
          temp.parent_3_id == topic.id
        );
      })
      .map((temp: Topic) => temp.field);
  };

  getAllChildren = (topic: Topic) => { 

  }

  render() {
    return (
      <Box width="100%">
        <Box
          width="100%"
          direction="row"
          gap="xsmall"
          align="end"
          margin={{ bottom: "15px" }}
        >
          <Text size="26px" weight="bold" color="black" margin="none">
            Filter by topic
          </Text>
        </Box>

        <Box
          width="100%"
          direction="row"
          gap="xsmall"
          align="end"
          margin={{ bottom: "15px" }}
        >

        {this.state.topicBeingShown >= 0 && (
          <Select
            options={this.getPrimitiveNodes().concat("-")}
            placeholder={"Field"}
            onChange={({ option }) =>
              this.onFieldChoose(this.nameToTopic(option), 0)
            }
          />
        )}
        {this.state.topicBeingShown >= 1 && (
          <Select
            options={this.getChildren(
              this.state.topics[0]
            ).concat("-")}
            placeholder={"Topic"}
            onChange={({ option }) =>
              this.onFieldChoose(this.nameToTopic(option), 1)
            }
          />
        )}
        {this.state.topicBeingShown >= 2 && (
          <Select
            options={this.getChildren(
              this.state.topics[1]
            ).concat("-")}
            placeholder={"Subject"}
            onChange={({ option }) =>
              this.onFieldChoose(this.nameToTopic(option), 2)
            }
          />
        )}
        </Box>  
      </Box>
    );
  };
}
