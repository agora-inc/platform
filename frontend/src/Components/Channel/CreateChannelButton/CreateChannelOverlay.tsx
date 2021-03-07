import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Text, Box, TextInput, TextArea, Button } from "grommet";
import AsyncButton from "../../Core/AsyncButton";
import { User } from "../../../Services/UserService";
import { Previous } from "grommet-icons";
import { Channel, ChannelService } from "../../../Services/ChannelService";
import ChannelTopicSelector from "../ChannelTopicSelector";
import { Topic } from "../../../Services/TopicService";
import { Overlay, OverlaySection } from "../../Core/Overlay";


interface Props {
  user: User | null;
  onBackClicked: any;
  onComplete: any;
  channel?: Channel;
  visible: boolean;
}

interface State {
  newChannelName: string;
  newChannelDescription: string;
  redirect: boolean;
  topics: Topic[];
  isPrevTopics: boolean[];
}

export default class CreateChannelOverlay extends Component<Props, State> {
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
      },
      this.state.topics
    );
    // close modal
    this.props.onBackClicked()
  };

  containsSpecialCharacter = (name: string) => {
    let check = /[`~@£$%^&*=+{}\[\]'"\\\|\/?<>]/;
    let test = name.toLowerCase().replace(/[0-9]/g, " ");
    if(test.match(check)) {
      return true;
    } else {
      return false;
    }
  }

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

  isComplete = () => {
    return (
      this.state.newChannelName !== "" &&
      this.state.newChannelName.length >= 5 &&
      !(this.containsSpecialCharacter(this.state.newChannelName)) &&
      this.state.topics.length > 0
    );
  };


  render() {
    return this.state.redirect ? (
      <Redirect to={`/${this.state.newChannelName}`} />
    ) : (
      <Overlay
      width={500}
      height={300}
      visible={this.props.visible}
      title={`Create an Agora`}
      submitButtonText="Create"
      onSubmitClick={this.onCreateClicked}
      contentHeight="150px"
      canProceed={this.isComplete()}
      onCancelClick={this.props.onBackClicked}
      onClickOutside={this.props.onBackClicked}
      onEsc={this.props.onBackClicked}
      >
        <OverlaySection>
          <TextInput
            style={{ width: "100%", marginTop: "5px"}}
            placeholder="Your agora name"
            onChange={(e) => this.setState({ newChannelName: e.target.value })}
          />
        </OverlaySection>
        <OverlaySection>
          <ChannelTopicSelector 
            onSelectedCallback={this.selectTopic}
            onCanceledCallback={this.cancelTopic}
            isPrevTopics={this.state.isPrevTopics}
            prevTopics={this.props.channel ? this.props.channel.topics : []} 
            textSize="medium"
          />
        </OverlaySection>
        {this.containsSpecialCharacter(this.state.newChannelName) ? (
            <Text
            color="red"
            size="12px"
            style={{ marginBottom: "12px" }}
            >
              Agora name cannot contain special characters
            </Text>
          ) : (null)}
      </Overlay>
    );
  }
}
