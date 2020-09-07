import React, { Component } from "react";
import { Box, Text, Select } from "grommet";
import { Topic, TopicService } from "../../Services/TopicService";
import { Close } from "grommet-icons";
// import allTopics from "../../assets/allTopics.json"
import Button from "../Core/Button";
import Icon from "@ant-design/icons";

interface State {
  all: Topic[],
  topics: Topic[][];
  topicsShown: number[];
  isFilledTopics: boolean[];
}

interface Props {
  onSelectedCallback: any;
  prevTopics: Topic[];
  isPrevTopics: boolean[];
  size?: string;
}

export default class TopicSelector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      all: [],
      topics: [[], [], []],
      topicsShown: [0, 0, 0],
      isFilledTopics: this.props.isPrevTopics,
    };
  }

  componentWillMount() {
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ all: allTopics });
    });
  }

  onAddTopicShown = (choice: number) => {
    return ( () => {
      let tempTopics = this.state.topics;
      let tempTopicsShown = this.state.topicsShown;
      tempTopics[choice] = []
      tempTopicsShown[choice] = 1;
      this.setState({ 
        topicsShown: tempTopicsShown,
        topics: tempTopics 
      });
    })
  };

  onCancelTopicShown = (choice: number) => {
    return ( () => {
      let tempTopics = this.state.topics;
      let tempShown = this.state.topicsShown;
      tempTopics[choice] = []
      tempShown[choice] = 0;
      this.setState({ 
        topicsShown: tempShown,
        topics: tempTopics 
      });
      if (this.state.isFilledTopics[choice]) {
        let tempIsFilled = this.state.isFilledTopics;
        tempIsFilled[choice] = false
        this.setState({
          isFilledTopics: tempIsFilled
        })

      }
    })
  };

  onFieldChoose = (choice: number, topic: Topic, fieldDepth: number) => {
    let tempShown = this.state.topicsShown;
    if (topic.id >= 0) {
      tempShown[choice] = fieldDepth + 1;
      this.props.onSelectedCallback(topic, choice);
    } else {
      tempShown[choice] = fieldDepth; 
    }
    let tempTopics = this.state.topics;
    tempTopics[choice] = tempTopics[choice].slice(0, fieldDepth);
    tempTopics[choice].push(topic);
    this.setState({
      topics: tempTopics,
      topicsShown: tempShown,
    });
  };

  nameToTopic = (name: string): Topic => {
    if (name == "All") {
      return {field: "All",
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
    if (name == "All") {
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



  renderTopicChoice = (choice: number) => {
    if (this.state.isFilledTopics[choice]) {
      return (
        <Box
          width="100%"
          direction="row"
          gap="xsmall"
          align="center"
          margin={{ bottom: "15px" }}
        >
          <Text size={this.props.size} weight="bold">
            {this.props.prevTopics[choice].field}
          </Text>
          <Box margin={{left: "10px"}}>
            <Close onClick={this.onCancelTopicShown(choice)} />
          </Box>
        </Box>
      );
    } else if (this.state.topicsShown[choice] > 0) {
      return (
        <Box
          width="100%"
          direction="row"
          gap="xsmall"
          align="center"
          margin={{ bottom: "15px" }}
        >
          {this.state.topicsShown[choice] > 0 && (
            <Select
              searchPlaceholder={"All"}
              options={this.getPrimitiveNodes().concat("All")}
              onChange={({ option }) =>
                this.onFieldChoose(choice, this.nameToTopic(option), 1)
              }
              size={this.props.size}
            />
          )}
          {this.state.topicsShown[choice] > 1 && (
            <Select
              options={this.getChildren(
                this.state.topics[choice][0]
              ).concat("All")}
              onChange={({ option }) =>
                this.onFieldChoose(choice, this.nameToTopic(option), 2)
              }
              size={this.props.size}
            />
          )}
          {this.state.topicsShown[choice] > 2 && (
            <Select
              options={this.getChildren(
                this.state.topics[choice][1]
              ).concat("All")}
              onChange={({ option }) =>
                this.onFieldChoose(choice, this.nameToTopic(option), 2)
              }
              size={this.props.size}
            />
          )}
          {this.state.topicsShown[choice] > 0 && (
            <Box margin={{left: "10px"}}>
            <Close onClick={this.onCancelTopicShown(choice)} />
            </Box>
          )}
        </Box>
      );
    } else {
      return (
        <Box
          focusIndicator={false}
          background="white"
          round="xsmall"
          pad={{ vertical: "2px", horizontal: "xsmall" }}
          onClick={this.onAddTopicShown(choice)}
          style={{
            width: "10%",
            border: "1px solid #C2C2C2",
          }}
          hoverIndicator={true}
          align="center"
          margin={{bottom: "24px"}}   
        >
          <Text color="grey" size="small"> 
            + Add 
          </Text>
        </Box>
      );
    }
  };

  render() {
    return (
      <Box width="100%" direction="column" margin={{top: "12px"}}>
        {this.renderTopicChoice(0)}
        {this.renderTopicChoice(1)}
        {this.renderTopicChoice(2)}
      </Box>
    );
  }
}
