import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User } from "../../Services/UserService";
import { Talk } from "../../Services/TalkService";
import { Topic } from "../../Services/TopicService";
import { ChannelService } from "../../Services/ChannelService";
import { RSScraping } from "../../Services/RSScrapingService";
import { Box, Text, TextInput, Select, CheckBox, Layer, Image } from "grommet";
import { StatusInfo, Close, Checkmark } from "grommet-icons";
import ReactTooltip from "react-tooltip";
import { Overlay } from "../Core/Overlay";
import Switch from "../Core/Switch";
import { LoginButton } from "../Account/LoginButton";
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
  autoAcceptEnabled: boolean;
  autoAcceptGroup: "Everybody" | "Academics" | "None";
  autoAcceptCustomInstitutions: boolean;
  showProgressOverlay: boolean;
  isValidSeries: number; // 1 is valid, 0 otherwise
  allTalkIds: number[];
  channelId: number;
  channelName: string;
  nTalksParsed: number;
}

export default class TransportSeminars extends Component<Props, State> {
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
      allTalkIds: [],
      channelId: -1,
      channelName: "",
      nTalksParsed: 0,
    };
  }

  toggleOverlay = () => {
    this.setState({ showOverlay: !this.state.showOverlay });
  };
  toggleProgressOverlay = () => {
    this.setState({ showProgressOverlay: !this.state.showProgressOverlay });
  };

  selectTopic = (topic: Topic, num: number) => {
    let tempTopics = this.state.topics;
    tempTopics[num] = topic;
    this.setState({
      topics: tempTopics,
    });
  };

  cancelTopic = (num: number) => {
    let tempTopics = this.state.topics;
    tempTopics[num] = {
      field: "",
      id: 0,
      is_primitive_node: false,
      parent_1_id: -1,
      parent_2_id: -1,
      parent_3_id: -1,
    };
    this.setState({
      topics: tempTopics,
    });
  };

  handleCheckBox = (name: "Everybody" | "Academics" | "None") => {
    this.setState({
      autoAcceptGroup: name,
    });
  };

  isComplete = () => {
    return this.state.url !== "" && this.state.topics.length > 0;
  };

  isMigrating = () => {
    return (
      this.state.allTalkIds.length === 0 ||
      this.state.nTalksParsed < this.state.allTalkIds.length
    );
  };

  isMissing = () => {
    let res: string[] = [];
    if (this.state.url === "") {
      res.push("url");
    }
    if (this.state.topics.length === 0) {
      res.push("At least 1 topic");
    }
    return res;
  };

  textTitle = () => {
    if (this.state.isValidSeries) {
      if (this.isMigrating() && this.state.channelId > 0) {
        return "Agora created!";
      }
      if (!this.isMigrating() && this.state.channelId > 0) {
        return "Success!";
      }
      if (this.isMigrating() && this.state.channelId <= 0) {
        return "Error...";
      }
    } else {
      return "Not found...";
    }
  };

  async scheduleAllTalks(
    channelId: number,
    channelName: string,
    talkIds: number[],
    talkLink: string
  ) {
    var chunks = [],
      i = 0,
      n = talkIds.length;
    while (i < n) {
      chunks.push(talkIds.slice(i, Math.min(i + 5, n)));
      i += 5;
    }

    for (const ids of chunks) {
      await RSScraping.scheduleTalks(
        this.state.url,
        channelId,
        channelName,
        ids,
        talkLink,
        this.state.topics[0].id,
        this.state.audienceLevel,
        this.state.onRegistration ? "Members only" : "Everybody",
        this.state.autoAcceptGroup,
        (talks: Talk[]) => {
          this.setState({
            nTalksParsed: this.state.nTalksParsed + talks.length,
          });
        }
      );
    }
  }

  onSubmitClick = () => {
    // Try if the series indeed exists and create agora
    if (this.props.user) {
      RSScraping.createAgoraGetTalkIds(
        this.state.url,
        this.props.user.id,
        this.state.topics[0].id,
        (res: {
          isValidSeries: number;
          allTalkIds: number[];
          channelId: number;
          channelName: string;
          talkLink: string;
        }) => {
          this.setState({ isValidSeries: res.isValidSeries });
          this.setState({ allTalkIds: res.allTalkIds });
          this.setState({ channelId: res.channelId });
          this.setState({ channelName: res.channelName });
          this.toggleProgressOverlay();
          this.scheduleAllTalks(
            res.channelId,
            res.channelName,
            res.allTalkIds,
            res.talkLink
          );
        }
      );
    }
  };

  /*
  onSubmitClick = () => {
    // Try if the series indeed exists
    RSScraping.getValidSeriesAndNtalks(
      this.state.url,
      (res: number[]) => {
        this.setState({ isValidSeries: res[0] })
        this.setState({ numberTalksSeries: res[1] })
        this.toggleProgressOverlay()
        if (res[0] === 1 && this.props.user) {
          this.toggleOverlay()
          RSScraping.getChannelAllTalks(
            this.state.url,
            this.props.user.id,
            this.state.topics[0].id,
            this.state.audienceLevel,
            this.state.onRegistration ? "Members only" : "Everybody",
            this.state.autoAcceptGroup,
            (res: {channelId: number, channelName: string}) => {
              this.setState({ migrating: false })
              this.setState({ channelId: res.channelId })
              this.setState({ channelName: res.channelName })
            }
          )
        }
      }
    )
  } */

  render() {
    var auto_accept =
      "'Automatically accepting a registration' means that the person registering " +
      "to your event will automatically receive the details by email if they belong to one of the group you selected below";
    return (
      <>
        <Box
          direction="row"
          onClick={this.toggleOverlay}
          align="center"
          width="400px"
          height="90px"
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
          <Text size="22.5px">🚀</Text>
          <Text size="18px" color="white" weight="bold">
            Import from researchseminars.org
          </Text>
        </Box>

        {this.state.showOverlay && (
          <Overlay
            width={600}
            height={580}
            visible={true}
            title={
              this.props.user === null
                ? "Get started!"
                : "Transport your seminar series"
            }
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
                <Box style={{ minHeight: "40%" }} />
                <Box direction="row" align="center" gap="10px">
                  <LoginButton callback={() => {}} />
                  <Text size="14px"> or </Text>
                  <SignUpButton callback={() => {}} />
                  <Text size="14px"> to proceed </Text>
                </Box>
              </>
            )}

            {this.props.user !== null && (
              <Box align="start">
                <Text size="14px" weight="bold">
                  1. Enter here the url of your series on researchseminars.org
                </Text>
                <TextInput
                  style={{ width: "100%", marginTop: "5px" }}
                  placeholder="https://researchseminars.org/seminar/yourname"
                  onChange={(e) => this.setState({ url: e.target.value })}
                />
                <Text
                  size="14px"
                  weight="bold"
                  margin={{ top: "20px", bottom: "-5px" }}
                >
                  2. Choose the most appropriate field
                </Text>
                <ChannelTopicSelector
                  onSelectedCallback={this.selectTopic}
                  onCanceledCallback={this.cancelTopic}
                  isPrevTopics={this.state.isPrevTopics}
                  prevTopics={[]}
                  textSize="medium"
                />
                <Text
                  size="14px"
                  weight="bold"
                  margin={{ top: "10px", bottom: "5px" }}
                >
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
                <Box
                  direction="row"
                  gap="10px"
                  align="center"
                  margin={{ top: "20px", bottom: "10px" }}
                >
                  <Text size="14px" weight="bold">
                    {" "}
                    4. Do you require registration on your events?{" "}
                  </Text>
                  <Switch
                    width={60}
                    height={24}
                    checked={this.state.onRegistration}
                    textOn="Yes"
                    textOff="No"
                    callback={(checked: boolean) => {
                      this.setState({
                        onRegistration: checked,
                        autoAcceptGroup: "None",
                      });
                      // close sub-switch
                      if (!checked) {
                        this.setState({ autoAcceptEnabled: checked });
                      }
                    }}
                  />
                </Box>
                {this.state.onRegistration && (
                  <Box margin={{ bottom: "20px" }} gap="15px">
                    <Box direction="row" gap="small" margin={{ bottom: "0px" }}>
                      <Text size="14px" weight="bold">
                        Automatically accept some users?
                      </Text>
                      <Switch
                        width={60}
                        height={24}
                        checked={this.state.autoAcceptEnabled}
                        textOn="Yes"
                        textOff="No"
                        callback={(checked: boolean) => {
                          this.setState({
                            autoAcceptEnabled: checked,
                          });
                          if (!checked) {
                            this.setState({
                              autoAcceptGroup: "None",
                            });
                          }
                        }}
                      />
                      <StatusInfo
                        style={{ marginTop: "3px" }}
                        size="small"
                        data-tip={auto_accept}
                        data-for="automatic-registration"
                      />
                      <ReactTooltip
                        id="automatic-registration"
                        place="right"
                        effect="solid"
                        html={true}
                      />
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
                        <Text size="14x" margin={{ top: "20px" }}>
                          <i>
                            Everybody else will need to be manually approved.
                          </i>
                        </Text>
                      </>
                    )}
                  </Box>
                )}
                {!this.state.onRegistration && (
                  <Text size="14px">
                    {" "}
                    Your events are going to be public, and the link to your
                    talk will be shown on mora.stream 15 minutes before the
                    start.{" "}
                  </Text>
                )}
              </Box>
            )}
          </Overlay>
        )}
        {this.state.showProgressOverlay && (
          <Layer
            onEsc={this.toggleProgressOverlay}
            // onClickOutside={this.toggleProgressOverlay}
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
            <Box width="100%" style={{ overflowY: "auto" }}>
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
                    {this.textTitle()}
                  </Text>
                </Box>
                <Box pad="32px" alignSelf="center">
                  <Close onClick={this.toggleProgressOverlay} />
                </Box>
              </Box>
              {this.state.isValidSeries === 1 && this.isMigrating() && (
                <Box margin={{ top: "30px", left: "30px", bottom: "40px" }}>
                  <Text size="16px" margin={{ bottom: "30px" }}>
                    Migration of your talks in progress...
                  </Text>
                  <Box align="start">
                    <Box
                      round="xsmall"
                      height="25px"
                      width="540px"
                      align="start"
                      background="#DDDDDD"
                    />
                    <Box
                      height="25px"
                      round="xsmall"
                      style={{
                        width:
                          Math.floor(
                            (540 * this.state.nTalksParsed) /
                              this.state.allTalkIds.length
                          ).toString() + "px",
                      }}
                      background="#0C385B"
                      margin={{ top: "-25px", bottom: "50px" }}
                      align="start"
                      justify="center"
                    >
                      <Text
                        size="14px"
                        alignSelf="end"
                        margin={{ right: "3px" }}
                      >
                        {Math.floor(
                          (100 * this.state.nTalksParsed) /
                            this.state.allTalkIds.length
                        )}
                        %
                      </Text>
                    </Box>
                  </Box>
                  <Text
                    size="14px"
                    alignSelf="end"
                    margin={{ right: "30px" }}
                    style={{ fontStyle: "italic" }}
                  >
                    Do not close this window
                  </Text>
                </Box>
              )}
              {this.state.isValidSeries === 1 &&
                !this.isMigrating() &&
                this.state.channelId > 0 && (
                  <Box margin={{ top: "30px", left: "30px" }}>
                    <Box
                      direction="row"
                      margin={{ bottom: "20px" }}
                      align="center"
                    >
                      <Text size="16px">
                        Go to your agora by clicking below
                      </Text>
                    </Box>
                    <Link
                      className="channel"
                      to={`/${this.state.channelName}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Box
                        direction="row"
                        gap="xsmall"
                        align="center"
                        round="xsmall"
                        pad={{ vertical: "6px", horizontal: "6px" }}
                      >
                        <Box
                          justify="center"
                          align="center"
                          background="#efeff1"
                          overflow="hidden"
                          style={{
                            minHeight: 30,
                            minWidth: 30,
                            borderRadius: 15,
                          }}
                        >
                          <img
                            src={ChannelService.getAvatar(this.state.channelId)}
                            height={30}
                            width={30}
                          />
                        </Box>
                        <Box justify="between">
                          <Text weight="bold" size="16px" color="grey">
                            {this.state.channelName}
                          </Text>
                        </Box>
                      </Box>
                    </Link>
                  </Box>
                )}
              {/*this.state.isValidSeries === 1 && !this.isMigrating() && this.state.channelId <= 0 && (
              <Box margin={{top: "30px", left: "30px"}}>
                <Box direction="row" margin={{bottom: "20px"}} align="center" gap="10px">
                  <Close color="red" /> 
                  <Text size="16px"> 
                    There was an error in the processing of your seminars. <br/>
                    Please try again or contact us.
                  </Text> 
                </Box>
              </Box>
            )*/}
              {this.state.isValidSeries !== 1 && (
                <Box margin={{ top: "30px", left: "30px" }}>
                  <Box
                    direction="row"
                    margin={{ bottom: "20px" }}
                    align="center"
                    gap="10px"
                  >
                    <Close color="red" />
                    <Text size="16px">
                      The url you entered does not correspond to any seminar
                      series. <br />
                      Please check that the url is correct or contact us.
                    </Text>
                  </Box>
                </Box>
              )}
            </Box>
          </Layer>
        )}
      </>
    );
  }
}
