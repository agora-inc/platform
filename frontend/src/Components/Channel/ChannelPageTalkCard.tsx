import React, { Component } from "react";
import { Box, Text, Button, Layer } from "grommet";
import Identicon from "react-identicons";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import { User } from "../../Services/UserService";
import { Tag } from "../../Services/TagService";
import { Talk, TalkService } from "../../Services/TalkService";
import EditTalkModal from "../Talks/EditTalkModal";
import AddToCalendarButtons from "../Talks/AddToCalendarButtons";
import { default as TagComponent } from "../Core/Tag";
import { ChannelService } from "../../Services/ChannelService";
import CountdownAndCalendarButtons from "../Talks/CountdownAndCalendarButtons";
import AsyncButton from "../Core/AsyncButton";


interface Props {
  talk: Talk;
  user: User | null;
  admin: boolean;
  onEditCallback?: any;
  width?: any;
  margin?: any;
}

interface State {
  showModal: boolean;
  registered: boolean;
  showShadow: boolean;
  available: boolean;
}

export default class ChannelPageTalkCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      registered: false,
      showShadow: false,
      available: true,
    };
  }

  checkIfRegistered = () => {
    this.props.user &&
      !this.props.admin &&
      TalkService.isRegisteredForTalk(
        this.props.talk.id,
        this.props.user.id,
        (registered: boolean) => {
          this.setState({ registered });
        }
      );
  };

  register = () => {
    this.props.user &&
      TalkService.registerForTalk(
        this.props.talk.id,
        this.props.user.id,
        () => {
          this.checkIfRegistered();
        }
      );
  };

  unregister = () => {
    this.props.user &&
      TalkService.unRegisterForTalk(
        this.props.talk.id,
        this.props.user.id,
        () => {
          this.checkIfRegistered();
        }
      );
  };

  onClick = () => {
    if (this.props.admin) {
      this.toggleModal();
    } else if (this.state.registered) {
      this.unregister();
    } else {
      this.register();
    }
  };

  formatDate = (d: string) => {
    const date = new Date(d);
    const dateStr = date.toDateString().slice(0, -4);
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    let label = "Log in to register";
    if (this.props.admin) {
      label = "Edit";
    } else if (this.props.user && !this.state.registered) {
      label = "Register";
    } else if (this.props.user && this.state.registered) {
      label = "Unregister";
    }
    // return (
    //   <Box
    //     width={this.props.width ? this.props.width : "32%"}
    //     margin={this.props.margin}
    //   >
    //     <Box
    //       background="white"
    //       round="10px"
    //       // align="center"
    //       pad="15px"
    //       width="100%"
    //       height="325px"
    //       justify="between"
    //       gap="small"
    //     >
    //       <Text weight="bold" size="20px" color="black">
    //         {this.props.talk.name}
    //       </Text>
    //       <Box gap="small">
    //         <Text
    //           size="18px"
    //           color="black"
    //           style={{ maxHeight: 150, overflow: "hidden" }}
    //         >
    //           {this.props.talk.description}
    //         </Text>
    //         <Box direction="row" gap="xsmall" wrap>
    //           {this.props.talk.tags.map((tag: Tag) => (
    //             <TagComponent
    //               tagName={tag.name}
    //               width="80px"
    //               colour="#f3f3f3"
    //             />
    //           ))}
    //         </Box>
    //         <Text size="18px" color="black" weight="bold">
    //           {this.formatDate(this.props.talk.date)}
    //         </Text>
    //         {this.state.registered && (
    //           <AddToCalendarButtons
    //             startTime={this.props.talk.date}
    //             endTime={this.props.talk.end_date}
    //             name={this.props.talk.name}
    //             description={this.props.talk.description}
    //             link={this.props.talk.link}
    //           />
    //         )}
    //         <Button
    //           onClick={this.onClick}
    //           primary
    //           color="black"
    //           disabled={!this.props.admin && this.props.user === null}
    //           label={label}
    //           size="large"
    //         ></Button>
    //       </Box>
    //     </Box>
    //     <EditTalkModal
    //       visible={this.state.showModal}
    //       channel={null}
    //       talk={this.props.talk}
    //       onFinishedCallback={() => {
    //         this.toggleModal();
    //         this.props.onEditCallback();
    //       }}
    //       onDeletedCallback={() => {
    //         this.toggleModal();
    //         this.props.onEditCallback();
    //       }}
    //       onCanceledCallback={this.toggleModal}
    //     />
    //   </Box>
    // );
    return (
      <Box
        width={this.props.width ? this.props.width : "32%"}
        height="180px"
        onClick={this.toggleModal}
        focusIndicator={false}
        style={{ position: "relative" }}
        margin={{ bottom: "small" }}
      >
        <Box
          onMouseEnter={() => this.setState({ showShadow: true })}
          onMouseLeave={() => {
            if (!this.state.showModal) {
              this.setState({ showShadow: false });
            }
          }}
          height="100%"
          width="100%"
          background="white"
          round="xsmall"
          justify="between"
          gap="small"
          overflow="hidden"
        >
          <Box height="100%" pad="10px">
            <Box
              direction="row"
              gap="xsmall"
              align="center"
              style={{ height: "40px" }}
              margin={{bottom: "10px"}}
            >
              <Box
                height="30px"
                width="30px"
                round="15px"
                justify="center"
                align="center"
                background="#efeff1"
                overflow="hidden"
              >
                {!this.props.talk.has_avatar && (
                  <Identicon string={this.props.talk.channel_name} size={15} />
                )}
                {!!this.props.talk.has_avatar && (
                  <img
                    src={ChannelService.getAvatar(this.props.talk.channel_id)}
                    height={30}
                    width={30}
                  />
                )}
              </Box>
              <Text
                weight="bold"
                size="16px"
                color="grey"
              >
                {this.props.talk.channel_name}
              </Text>
            </Box>
            <Text
              size="18px"
              color="black"
              weight="bold"
              style={{ minHeight: "70px", overflow: "auto" }}
            >
              {this.props.talk.name}
            </Text>
            <Box direction="row" gap="small">
              <UserExpert size="18px" />
              <Text
                size="18px"
                color="black"
                style={{ height: "30px", overflow: "auto", fontStyle: "italic" }}
                margin={{bottom: "10px"}}
              >
                {this.props.talk.talk_speaker ? this.props.talk.talk_speaker : "TBA" }
              </Text>
            </Box>
            <Box direction="row" gap="small">
              <Calendar size="18px" />
              <Text 
                size="18px" 
                color="black"
                style={{ height: "30px", fontStyle: "normal" }}
              >
                {this.formatDate(this.props.talk.date)}
              </Text>
            </Box>
          </Box>
        </Box>
        {this.state.showShadow && (
          <Box
            height="100%"
            width="100%"
            round="xsmall"
            style={{
              zIndex: -1,
              position: "absolute",
              top: 8,
              left: 8,
              opacity: 0.5,
            }}
            background={this.props.talk.channel_colour}
          ></Box>
        )}
        {this.state.showModal && (
          <Layer
            onEsc={() => {
              this.toggleModal();
              this.setState({ showShadow: false });
            }}
            onClickOutside={() => {
              this.toggleModal();
              this.setState({ showShadow: false });
            }}
            modal
            responsive
            animation="fadeIn"
            style={{
              width: 450,
              height: this.state.registered ? 540 : 500,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Box
              // align="center"
              pad="25px"
              // width="100%"
              height="100%"
              justify="between"
              gap="xsmall"
            >
              <Box style={{ minHeight: "100px", maxHeight: "460px" }} direction="column">
                <Box 
                  direction="row" 
                  gap="xsmall" 
                  style={{ minHeight: "30px" }} 
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
                      {!this.props.talk.has_avatar && (
                        <Identicon
                          string={this.props.talk.channel_name}
                          size={30}
                        />
                      )}
                      {!!this.props.talk.has_avatar && (
                        <img
                          src={ChannelService.getAvatar(
                            this.props.talk.channel_id
                          )}
                          height={30}
                          width={30}
                        />
                      )}
                    </Box>
                    <Box justify="between">
                      <Text
                        weight="bold"
                        size="18px"
                        color="grey"
                      >
                        {this.props.talk.channel_name}
                      </Text>
                    </Box>
                  </Box>
                </Box>
                <Text
                  weight="bold"
                  size="21px"
                  color="black"
                  style={{ minHeight: "50px", maxHeight: "120px", overflowY: "auto" }}
                  margin={{bottom: "20px", top: "10px"}}
                >
                  {this.props.talk.name}
                </Text>
                <Box direction="row" gap="small">
                  <UserExpert size="18px" />
                  <Text
                    size="18px"
                    color="black"
                    style={{ height: "30px", overflow: "auto", fontStyle: "italic" }}
                    margin={{bottom: "10px"}}
                  >
                    {this.props.talk.talk_speaker ? this.props.talk.talk_speaker : "TBA" }
                  </Text>
                </Box>
                <Text 
                  size="16px" 
                  color="black" 
                  style={{ minHeight: "50px", maxHeight: "200px", overflowY: "auto" }}
                  margin={{bottom: "10px"}}
                >
                  {this.props.talk.description}
                </Text>
              </Box>
              <Box direction="column" gap="small">
                <Box direction="row" gap="small">
                  <Calendar size="18px" />
                  <Text 
                    size="18px" 
                    color="black"
                    style={{ height: "20px", fontStyle: "normal" }}
                  >
                    {this.formatDate(this.props.talk.date)}
                  </Text>
                </Box>
                {this.state.registered && (
                  <CountdownAndCalendarButtons
                    talkStart={this.props.talk.date}
                    showLinkOffset={this.props.talk.show_link_offset}
                    link={this.props.talk.link}
                    color={this.props.talk.channel_colour}
                    startTime={this.props.talk.date}
                    endTime={this.props.talk.end_date}
                    name={this.props.talk.name}
                    description={this.props.talk.description}
                  />
                )}
                {this.state.available && (
                  <AsyncButton
                    color="#7E1115"
                    fontColor="white"
                    label={
                      this.props.user !== null
                        ? this.state.registered
                          ? "Unregister"
                          : "Register"
                        : "Log in to register"
                    }
                    disabled={this.props.user === null}
                    onClick={
                      this.state.registered ? this.unregister : this.register
                    }
                    width="420px"
                    height="40px"
                    round="xsmall"
                  />
                )}
              </Box>
            </Box>
            {!this.state.available && (
              <Box
                background="#d5d5d5"
                pad="small"
                align="center"
                justify="center"
              >
                <Text textAlign="center" weight="bold">
                  {`Sorry, this talk is only available to ${
                    this.props.talk.visibility === "Followers and members"
                      ? "followers and members"
                      : "members"
                  }
                  of ${this.props.talk.channel_name}`}
                </Text>
              </Box>
            )}
          </Layer>
        )}
      </Box>
    );
  }
}
