import React, { Component } from "react";
import { Redirect } from "react-router";
import { Box, Text } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import Loading from "../Components/Loading";
import Identicon from "react-identicons";
import ColorPicker from "../Components/ColorPicker";
import "../Styles/manage-channel.css";

interface Props {
  location: any;
}

interface State {
  channel: Channel | null;
  loading: boolean;
  allowed: boolean;
  followerCount: number;
  viewCount: number;
  colour: string;
  editingDescription: boolean;
  channelOwners: User[];
  channelMembers: User[];
  followers: User[];
}

export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      loading: true,
      allowed: false,
      followerCount: 0,
      viewCount: 0,
      colour: "pink",
      editingDescription: false,
      channelOwners: [],
      channelMembers: [],
      followers: [],
    };
  }

  componentWillMount() {
    this.getChannelAndCheckAccess();
  }

  getChannelAndCheckAccess = () => {
    ChannelService.getChannelByName(
      this.props.location.pathname.split("/")[2],
      (channel: Channel) => {
        let user = UserService.getCurrentUser();
        ChannelService.isUserInChannel(
          user.id,
          channel.id,
          ["owner", "member"],
          (res: boolean) => {
            this.setState(
              {
                channel: channel,
                colour: channel.colour,
                allowed: res,
                loading: false,
              },
              () => {
                this.fetchFollowerCount();
                this.fetchViewCount();
                this.fetchOwners();
                this.fetchMembers();
                this.fetchFollowers();
              }
            );
          }
        );
      }
    );
    // if (this.props.location.state) {
    //   this.setState(
    //     {
    //       channel: this.props.location.state.channel,
    //       colour: this.props.location.state.channel.colour,
    //       allowed: true,
    //       loading: false,
    //     },
    //     () => {
    //       this.fetchFollowerCount();
    //       this.fetchViewCount();
    //     }
    //   );
    // } else {
    //   ChannelService.getChannelByName(
    //     this.props.location.pathname.split("/")[2],
    //     (channel: Channel) => {
    //       let user = UserService.getCurrentUser();
    //       ChannelService.isUserInChannel(
    //         user.id,
    //         channel.id,
    //         (res: boolean) => {
    //           this.setState(
    //             {
    //               channel: channel,
    //               colour: channel.colour,
    //               allowed: res,
    //               loading: false,
    //             },
    //             () => {
    //               this.fetchFollowerCount();
    //               this.fetchViewCount();
    //             }
    //           );
    //         }
    //       );
    //     }
    //   );
    // }
  };

  fetchFollowerCount = () => {
    ChannelService.getFollowerCountForChannel(
      this.state.channel!.id,
      (followerCount: number) => {
        this.setState({ followerCount });
      }
    );
  };

  fetchViewCount = () => {
    ChannelService.getViewsForChannel(
      this.state.channel!.id,
      (viewCount: number) => {
        this.setState({ viewCount });
      }
    );
  };

  fetchOwners = () => {
    ChannelService.getUsersForChannel(
      this.state.channel!.id,
      ["owner"],
      (owners: User[]) => {
        this.setState({ channelOwners: owners });
      }
    );
  };

  fetchMembers = () => {
    ChannelService.getUsersForChannel(
      this.state.channel!.id,
      ["member"],
      (members: User[]) => {
        this.setState({ channelMembers: members });
      }
    );
  };

  fetchFollowers = () => {
    ChannelService.getUsersForChannel(
      this.state.channel!.id,
      ["follower"],
      (followers: User[]) => {
        this.setState({ followers });
      }
    );
  };

  updateColour = (colour: string) => {
    this.setState({ colour });
    ChannelService.updateChannelColour(
      this.state.channel!.id,
      colour,
      () => {}
    );
  };

  onEditDescriptionClicked = () => {
    if (this.state.editingDescription) {
      ChannelService.updateChannelDescription(
        this.state.channel!.id,
        document.getElementById("description")!.textContent as string,
        () => {}
      );
    }
    this.setState({ editingDescription: !this.state.editingDescription });
  };

  render() {
    if (this.state.loading) {
      return (
        <Box width="100%" height="100%" justify="center" align="center">
          <Loading color="black" size={50} />
        </Box>
      );
    } else {
      return this.state.allowed ? (
        <Box>
          {" "}
          <Box
            width="100%"
            height="100%"
            align="center"
            margin={{ top: "100px" }}
          >
            <Box width="75%" align="start">
              <Box
                height="225px"
                width="100%"
                round="10px"
                background={this.state.colour}
                pad="20px"
                margin={{ top: "40px", bottom: "30px" }}
                direction="row"
                justify="between"
              >
                <Box
                  width="50%"
                  height="100%"
                  round="10px"
                  background="#e5e5e5"
                  direction="row"
                  // align="center"
                  // justify="between"
                  gap="small"
                  pad="15px"
                >
                  <Box
                    width="120px"
                    height="120px"
                    round="60px"
                    background="white"
                    justify="center"
                    align="center"
                    style={{ minWidth: 120, minHeight: 120 }}
                  >
                    <Identicon string={this.state.channel?.name} size={60} />
                  </Box>
                  <Box gap="small">
                    <Text weight="bold" size="30px">
                      {this.state.channel?.name}
                    </Text>
                    <Text
                      id="description"
                      className="channel-description"
                      size="22px"
                      margin="none"
                      contentEditable={this.state.editingDescription}
                      style={
                        this.state.editingDescription
                          ? {
                              border: `2px solid ${this.state.colour}`,
                              borderRadius: 7,
                              padding: 5,
                              overflow: "scroll",
                              height: 90,
                              maxHeight: 90,
                            }
                          : {}
                      }
                    >
                      {this.state.channel?.description}
                    </Text>
                    <Box
                      focusIndicator={false}
                      margin={{ top: "-10px" }}
                      pad="none"
                      onClick={this.onEditDescriptionClicked}
                    >
                      <Text style={{ textDecoration: "underline" }} size="16px">
                        {this.state.editingDescription ? "save" : "edit"}
                      </Text>
                    </Box>
                  </Box>
                </Box>
                <Box justify="between" align="end">
                  <ColorPicker
                    selected={this.state.colour}
                    callback={this.updateColour}
                  />
                  <Box direction="row" gap="medium">
                    <Text
                      weight="bold"
                      size="22px"
                    >{`${this.state.followerCount} followers`}</Text>
                    <Text
                      weight="bold"
                      size="22px"
                    >{`${this.state.viewCount} views`}</Text>
                  </Box>
                </Box>
              </Box>
              <Box direction="row" width="100%" justify="between">
                <Box
                  width="31.5%"
                  height="300px"
                  background="#e5e5e5"
                  round="7.5px"
                  pad="10px"
                >
                  <Text weight="bold" size="20px">
                    Channel owners
                  </Text>
                  <Box direction="row" wrap margin={{ top: "5px" }}>
                    {this.state.channelOwners.map((owner: User) => (
                      <Box
                        background="white"
                        height="50px"
                        width="50px"
                        round="25px"
                        justify="center"
                        align="center"
                      >
                        <Identicon string={owner.username} size={30} />
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  width="31.5%"
                  height="300px"
                  background="#e5e5e5"
                  round="7.5px"
                  pad="10px"
                >
                  <Text weight="bold" size="20px">
                    Channel members
                  </Text>
                  <Box direction="row" wrap margin={{ top: "5px" }}>
                    {this.state.channelMembers.map((member: User) => (
                      <Box
                        background="white"
                        height="50px"
                        width="50px"
                        round="25px"
                        justify="center"
                        align="center"
                      >
                        <Identicon string={member.username} size={30} />
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  width="31.5%"
                  height="300px"
                  background="#e5e5e5"
                  round="7.5px"
                  pad="10px"
                >
                  <Text weight="bold" size="20px">
                    Followers
                  </Text>
                  <Box direction="row" wrap margin={{ top: "5px" }}>
                    {this.state.followers.map((follower: User) => (
                      <Box
                        background="white"
                        height="50px"
                        width="50px"
                        round="25px"
                        justify="center"
                        align="center"
                      >
                        <Identicon string={follower.username} size={30} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }
  }
}
