import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Text, Box, TextInput, TextArea, Button } from "grommet";
import AsyncButton from "../Core/AsyncButton";
import { User } from "../../Services/UserService";
import { Previous } from "grommet-icons";
import { Channel, ChannelService } from "../../Services/ChannelService";
import ChannelTopicSelector from "../Channel/ChannelTopicSelector";
import { Topic } from "../../Services/TopicService";


import RichTextEditor from 'react-rte';


interface Props {
  user: User | null;
  onBackClicked: any;
  onComplete: any;
  channel?: Channel;
}

interface State {
  newChannelName: string;
  newChannelDescription: string;
  redirect: boolean;
  topics: Topic[];
  isPrevTopics: boolean[];
}

export default class CreateChannelCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newChannelName: "",
      newChannelDescription: "",
      redirect: false,
      topics: this.props.channel ? this.props.channel.topics : [],
      isPrevTopics: this.props.channel ? this.topicExists(this.props.channel.topics) : [false, false, false]
    };
  }

  onCreateClicked = (callback: any) => {
    ChannelService.createChannel(
      this.state.newChannelName,
      this.state.newChannelDescription,
      this.props.user!.id,
      () => {
        callback();
        this.setState({ redirect: true }, () => {
          this.props.onComplete();
        });
      }
    );
  };

  topicExists = (topics: Topic[]) => {
    let res = [];
    for (let topic in topics) {
      if (topic) {
        res.push(true)
      } else {
        res.push(false)
      }
    }
    return res;
  }

  selectTopic = (topic: Topic, num: number) => {
    let tempTopics = this.state.topics;
    tempTopics[num] = topic;
    this.setState({
      topics: tempTopics
    });
  }

  cancelTopic = (num: number) => {
    let tempTopics = this.state.topics;
    tempTopics[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1, 
      parent_3_id: -1,
    }
    this.setState({
      topics: tempTopics
    });
  }

  render() {
    return this.state.redirect ? (
      <Redirect to={`/${this.state.newChannelName}`} />
    ) : (
      <Box
        gap = "small"
        width="100%"
        height="100%"
        background="white"
        pad="small"
        justify="between"
      >
        <Box
          direction="row"
          width="100%"
          // gap="xsmall"
          pad="none"
          margin={{ left: "-7px" }}
        >
          <Box
            onClick={() => this.props.onBackClicked()}
            focusIndicator={false}
          >
            <Previous color="black" />
          </Box>
          <Text weight="bold" color="black" size="14px">
            Create an Agora
          </Text>
        </Box>


        
        <Box>
          <TextInput
            style={{ width: "100%" }}
            placeholder="Your Agora name"
            onChange={(e) => this.setState({ newChannelName: e.target.value })}
          />
          {/* <TextArea
            style={{ width: 300, height: 100 }}
            placeholder="Description"
            onChange={(e) =>
              this.setState({ newChannelDescription: e.target.value })
            }
          /> */}
          <Box margin={{ bottom: "small" }}>
            <ChannelTopicSelector 
              onSelectedCallback={this.selectTopic}
              onCanceledCallback={this.cancelTopic}
              isPrevTopics={this.state.isPrevTopics}
              prevTopics={this.props.channel ? this.props.channel.topics : []} 
              size="medium"
            />
          </Box>

          <AsyncButton
            color="#7E1115"
            fontColor="white"
            label="Create"
            disabled={
              this.state.newChannelName === ""
            }
            onClick={this.onCreateClicked}
            width="100%"
            height="40px"
            round="xsmall"
          />
        </Box>
      </Box>
    );
  }
}
