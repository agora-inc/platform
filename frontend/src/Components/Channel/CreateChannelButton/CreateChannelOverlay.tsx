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
import LoginModal from "../../Account/LoginModal";
import SignUpButton from "../../Account/SignUpButton";

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
  newChannelContactEmail: string;
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
      newChannelContactEmail: "",
      redirect: false,
      topics: this.props.channel ? this.props.channel.topics : [],
      isPrevTopics: this.props.channel ? this.topicExists(this.props.channel.topics) : [false, false, false]
    };
  }

  onCreateClicked = () => {
    ChannelService.createChannel(
      this.state.newChannelName,
      this.state.newChannelDescription,
      this.props.user!.id,
      (r:string) => {
        this.setState({ redirect: true }, () => {
        });
      },
      this.state.topics
      );
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
      height={380}
      visible={this.props.visible}
      title={this.props.user === null ? "Get started!" : `Create an Agora`}
      submitButtonText="Create"
      disableSubmitButton={this.props.user === null ? true : false}
      onSubmitClick={this.onCreateClicked}
      contentHeight="230px"
      canProceed={this.isComplete()}
      onCancelClick={this.props.onBackClicked}
      onClickOutside={this.props.onBackClicked}
      onEsc={this.props.onBackClicked}
      >

        {this.props.user === null && (
                <>
                  <Box style={{minHeight: "40%"}} />
                  <Box direction="row" align="center" gap="10px">
                    <LoginModal callback={() => {}} />
                    <Text size="14px"> or </Text>
                    <SignUpButton callback={() => {}} />
                    <Text size="14px"> to proceed </Text>
                  </Box>
                </>
                )}  

      {!(this.props.user === null) && (
        <>
          <OverlaySection>
            An agora is a hub for your community. It is the place where you organise and advertise all your events, past or future, and where speakers come and apply. Give your community a name and classification before getting started!
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
        </>
      )}


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
