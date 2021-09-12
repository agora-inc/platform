import React, { Component } from "react";
import { User } from "../../Services/UserService";
import { Topic } from "../../Services/TopicService";
import { Box, Text, TextInput} from "grommet";
import ReactTooltip from "react-tooltip";
import { Overlay, OverlaySection } from "../Core/Overlay";
import LoginModal from "../Account/LoginModal";
import SignUpButton from "../Account/SignUpButton";
import ChannelTopicSelector from "../Channel/ChannelTopicSelector";


interface Props {
	user: User | null;
}

interface State {
  showOverlay: boolean;
  url: string;
  topics: Topic[];
  isPrevTopics: boolean[];
}


export default class AgoraCreationPage extends Component<Props, State> {
	constructor(props: any) {
		super(props);		
		this.state = {
      showOverlay: false,
      url: "",
      topics: [],
      isPrevTopics: [false, false, false],
    };
	}
	
	toggleOverlay() {
		this.setState({showOverlay: !this.state.showOverlay})
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
  
  isComplete() {
    return true
  }

  onSubmitClick() {

  }

  render() {
    return (
      <>
      <Box
        data-tip data-for="create_agora_button"
        direction="row"
        onClick={this.toggleOverlay}
        align="center"
        width="280px"
        height="70px"
        round="xsmall"
        pad="small"
        gap="10px"
        style={{
          border: "2px solid #C2C2C2",
        }}
        background="color1"
        hoverIndicator="color3"
        focusIndicator={false}
        justify="center"
      >
        <Text size="16px" color="white" weight="bold">
          Migrate your seminars
        </Text>
        <Text size="22.5px">🚀</Text>
        <ReactTooltip id="create_agora_button" effect="solid">
            Migrate your seminar series on researchseminars.org in less than a minute!
        </ReactTooltip>
      </Box>

      {this.state.showOverlay && (
        <Overlay
          width={500}
          height={500}
          visible={true}
          title={this.props.user === null ? "Get started!" : "Transport your seminar series"}
          submitButtonText="Transport"
          disableSubmitButton={this.props.user === null ? true : false}
          onSubmitClick={this.onSubmitClick}
          contentHeight="380px"
          canProceed={this.isComplete()}
          onCancelClick={this.toggleOverlay}
          onClickOutside={this.toggleOverlay}
          onEsc={this.toggleOverlay}
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
        
          {this.props.user !== null && (
            <>
            <OverlaySection>
              Enter here the url to your seminar series on researchseminars.org
              <TextInput
                style={{ width: "100%", marginTop: "5px"}}
                placeholder="url"
                onChange={(e) => this.setState({ url: e.target.value })}
              />
            </OverlaySection>
            <OverlaySection>
              <ChannelTopicSelector 
                onSelectedCallback={this.selectTopic}
                onCanceledCallback={this.cancelTopic}
                isPrevTopics={this.state.isPrevTopics}
                prevTopics={[]} 
                textSize="medium"
              />
            </OverlaySection>
            </>
          )}
        </Overlay>
      )}
      </>
  	);
  }
}