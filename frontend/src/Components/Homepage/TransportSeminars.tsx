import React, { Component } from "react";
import { User } from "../../Services/UserService";
import { Topic } from "../../Services/TopicService";
import { RSScraping } from "../../Services/RSScrapingService";
import { Box, Text, TextInput, Select, CheckBox, Layer } from "grommet";
import { StatusInfo, Close } from "grommet-icons";
import ReactTooltip from "react-tooltip";
import { Overlay } from "../Core/Overlay";
import Switch from "../Core/Switch";
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
  audienceLevel: string;
  onRegistration: boolean;
  autoAcceptEnabled: boolean,
  autoAcceptGroup: "Everybody" | "Academics" | "None";
  autoAcceptCustomInstitutions: boolean, 
  showProgressOverlay: boolean;
  isValidSeries: number; // 1 is valid, 0 otherwise
  numberTalksSeries: number;
}


export default class AgoraCreationPage extends Component<Props, State> {
	constructor(props: any) {
		super(props);		
		this.state = {
      showOverlay: false,
      url: "",
      topics: [],
      isPrevTopics: [false, false, false],
      audienceLevel: "General audience",
      onRegistration: false,
      autoAcceptEnabled: false,
      autoAcceptGroup: "Everybody",
      autoAcceptCustomInstitutions: false,
      showProgressOverlay: false,
      isValidSeries: 0,
      numberTalksSeries: 0,
    };
	}
	
	toggleOverlay = () => {
		this.setState({showOverlay: !this.state.showOverlay});
  }
  toggleProgressOverlay = () => {
		this.setState({showProgressOverlay: !this.state.showProgressOverlay});
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

  handleCheckBox = (name: "Everybody" | "Academics" | "None") => {
    this.setState({
      autoAcceptGroup: name
    });
  };
  
  isComplete = () => {
    return (
      this.state.url !== "" &&
      this.state.topics.length > 0
    );
  }

  isMissing = () => {
    let res: string[] = []
    if (this.state.url === "") {
      res.push("url")
    }
    if (this.state.topics.length === 0) {
      res.push("At least 1 topic")
    }
    return res
  }

  onSubmitClick = () => {
    // Try if the series indeed exists
    RSScraping.getValidSeriesAndNtalks(
      this.state.url,
      (res: number[]) => {
        this.setState({ isValidSeries: res[0] })
        this.setState({ numberTalksSeries: res[1] })
        this.toggleProgressOverlay()
      }
    )

    // If yes, start parsing everything

  }

  render() {
    console.log("Valid?", this.state.isValidSeries)
    console.log("Number of talks", this.state.numberTalksSeries)
    var auto_accept = "'Automatically accepting a registration' means that the person registering " + 
    "to your event will automatically receive the details by email if they belong to one of the group you selected below";
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
          width={600}
          height={580}
          visible={true}
          title={this.props.user === null ? "Get started!" : "Transport your seminar series"}
          submitButtonText="Transport"
          disableSubmitButton={this.props.user === null ? true : false}
          onSubmitClick={this.onSubmitClick}
          contentHeight="430px"
          canProceed={this.isComplete()}
          isMissing={this.isMissing()}
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
            <Box align="start"> 
              <Text size="14px">
                1. Enter here the url of your series on researchseminars.org
              </Text>
              <TextInput
                style={{ width: "100%", marginTop: "5px"}}
                placeholder="https://researchseminars.org/seminar/yourname"
                onChange={(e) => this.setState({ url: e.target.value })}
              />
              <Text size="14px">
                2. Choose the most appropriate field
              </Text>
              <ChannelTopicSelector 
                onSelectedCallback={this.selectTopic}
                onCanceledCallback={this.cancelTopic}
                isPrevTopics={this.state.isPrevTopics}
                prevTopics={[]} 
                textSize="medium"
              />
              <Text size="14px">
                3. Choose the target audience
              </Text>
              <Select
                dropAlign={{ bottom: "top" }}
                focusIndicator={false}
                id="link-visibility-select"
                options={["General audience", "Bachelor/Master", "PhD+"]}
                value={this.state.audienceLevel}
                onChange={({ option }) =>
                  this.setState({ audienceLevel: option })
                }
              />
              <Box direction="row" gap="10px"  align="center" margin={{top: "30px", bottom: "10px"}}>
                <Text size="13px" weight="bold"> 4. Do you require registration on your events? </Text>
                <Switch
                  width="60px"
                  height={24}
                  checked={this.state.onRegistration}
                  textOn="Yes" 
                  textOff="No"
                  callback={(checked: boolean) => {
                    this.setState({ 
                      onRegistration: checked,
                      autoAcceptGroup: "None"
                    });
                    // close sub-switch
                    if (!checked){
                      this.setState({ autoAcceptEnabled: checked });
                    }
                  }}
                />
              </Box>
              {this.state.onRegistration && (
                <Box margin={{bottom: "20px"}} gap="15px">
                  <Box direction="row" gap="small" margin={{ bottom: "0px" }}>
                    <Text size="13px" weight="bold"> 
                      Automatically accept some users?
                    </Text>
                    <Switch
                      width="60px"
                      height={24}
                      checked={this.state.autoAcceptEnabled}
                      textOn="Yes" 
                      textOff="No"
                      callback={(checked: boolean) => {
                        this.setState({ 
                          autoAcceptEnabled: checked,
                        });
                        if (!checked){
                          this.setState({
                            autoAcceptGroup: "None"
                          })
                        }
                      }}
                    />
                    <StatusInfo style={{marginTop: "3px"}} size="small" data-tip={auto_accept} data-for='automatic-registration'/>
                    <ReactTooltip id='automatic-registration' place="right" effect="solid" html={true}/>
                  </Box>
        
                  {this.state.autoAcceptEnabled && (
                    <>
                    <CheckBox
                      name="feature"
                      label="Everyone"
                      checked={this.state.autoAcceptGroup == "Everybody"}
                      onChange={() => this.handleCheckBox("Everybody")}
                    />
                    <CheckBox
                      name="bug"
                      label="Verified academics"
                      checked={this.state.autoAcceptGroup == "Academics"}
                      onChange={() => this.handleCheckBox("Academics")}
                    />
                    <Text size="13px" margin={{top: "20px"}}><i>Everybody else will need to be manually approved.</i></Text>

                  </>
                  )}
                </Box>
              )}
              {!this.state.onRegistration && (
                <Text size="13px"> Your events are going to be public, and the link to your talk will be shown on mora.stream 15 minutes before the start. </Text>
              )}
            </Box>

          )}
        </Overlay>
      )}
      {this.state.showProgressOverlay && (
        <Layer
          onEsc={this.toggleProgressOverlay}
          onClickOutside={this.toggleProgressOverlay}
          modal
          responsive
          animation="fadeIn"
          style={{
            width: "600px",
            height: "300px",
            borderRadius: 15,
            padding: 0,
          }}
        >
          <Box align="center" width="100%" style={{ overflowY: "auto" }}>
            <Box
              justify="start"
              width="99.7%"
              background="#eaf1f1"
              direction="row"
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                position: "sticky",
                top: 0,
                minHeight: "55px",
                zIndex: 10,
              }}
            >
              <Box pad="30px" alignSelf="center" fill={true}>
                <Text size="16px" color="black" weight="bold">
                  {this.state.isValidSeries === 1 ? "Success" : "Error"}
                </Text>
              </Box>
              <Box pad="32px" alignSelf="center">
                <Close onClick={this.toggleProgressOverlay}/>
              </Box>
            </Box>
            {this.state.isValidSeries === 1 && (
              <Box direction="row"> 
                <Text>
                  Number of talks to migrate:
                </Text>
                <Text> {this.state.numberTalksSeries} </Text>
                
              </Box> 
            )}
            {this.state.isValidSeries !== 1 && (
              <Text size="18px" color="black">
                The url you entered does not correspond to any seminar series. <b/>
                Please check that the url is correct or contact us.
              </Text>
            )}

          </Box>
        </Layer>

      )}
      </>
  	);
  }
}