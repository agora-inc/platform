import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Search } from "grommet-icons";
import { Dropdown, Menu } from "antd";
import { Channel } from "../Services/ChannelService";
import { Stream } from "../Services/StreamService";
import { Video } from "../Services/VideoService";
import { ScheduledStream } from "../Services/ScheduledStreamService";
import { Tag } from "../Services/TagService";
import { SearchService } from "../Services/SearchService";
import Identicon from "react-identicons";

interface State {
  searchString: string;
  loading: boolean;
  results: {
    channel: Channel[];
    stream: Stream[];
    video: Video[];
    scheduledStream: ScheduledStream[];
    tag: Tag[];
  };
}

export default class SiteWideSearch extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      searchString: "",
      loading: false,
      results: this.clearResults(),
    };
  }

  onSelect = () => {
    this.setState({
      searchString: "",
      results: this.clearResults(),
    });
  };

  clearResults = () => {
    return {
      channel: [],
      stream: [],
      video: [],
      scheduledStream: [],
      tag: [],
    };
  };

  areResultsEmpty = () => {
    const arrs = Object.values(this.state.results);
    for (let i in arrs) {
      if (arrs[i].length !== 0) {
        return false;
      }
    }
    return true;
  };

  search = (searchString: string) => {
    if (searchString === "") {
      this.setState({
        searchString: searchString,
        results: this.clearResults(),
      });
      return;
    }

    this.setState({ searchString, loading: true }, () => {
      SearchService.search(
        ["channel", "stream", "video", "scheduledStream", "tag"],
        this.state.searchString,
        (results: {
          channel: Channel[];
          stream: Stream[];
          video: Video[];
          scheduledStream: ScheduledStream[];
          tag: Tag[];
        }) => {
          this.setState({ results, loading: false });
        }
      );
    });
  };

  menu = () => {
    return (
      <Menu
        style={{
          borderRadius: 4,
          overflow: "hidden",
          padding: 0,
          width: "27vw",
        }}
      >
        {this.state.results.channel.length !== 0 && (
          <Box>
            <Box
              background="#f5f5f5"
              width="100%"
              pad="xsmall"
              style={{
                borderTop: "1px solid #d2d2d2",
                borderBottom: "1px solid #d2d2d2",
              }}
            >
              <Text weight="bold" size="14px">
                Channels
              </Text>
            </Box>
            <Box style={{ maxHeight: 125, overflowY: "scroll" }}>
              {this.state.results.channel.map((channel: Channel) => (
                <Link
                  to={{
                    pathname: `/channel/${channel.name}`,
                    state: { channel },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={this.onSelect}
                    width="100%"
                    // direction="row"
                    // align="center"
                    gap="xsmall"
                    pad="xsmall"
                    focusIndicator={false}
                    hoverIndicator={true}
                    style={{ borderTop: "1px solid #d2d2d2" }}
                  >
                    <Box direction="row" gap="xsmall" align="center">
                      <Box
                        height="20px"
                        width="20px"
                        round="10px"
                        overflow="hidden"
                      >
                        {!channel.has_avatar && (
                          <Identicon string={channel.name} size={20} />
                        )}
                        {!!channel.has_avatar && (
                          <img
                            src={`/images/channel-icons/${channel.id}.jpg`}
                          />
                        )}
                      </Box>
                      <Text color="black">{channel.name}</Text>
                    </Box>
                    <Text size="14px" color="#656565">
                      {channel.description}
                    </Text>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        )}
        {this.state.results.stream.length !== 0 && (
          <Box>
            <Box
              background="#f5f5f5"
              width="100%"
              pad="xsmall"
              style={{
                borderTop: "1px solid #d2d2d2",
                borderBottom: "1px solid #d2d2d2",
              }}
            >
              <Text weight="bold" size="14px">
                Ongoing streams
              </Text>
            </Box>
            <Box style={{ maxHeight: 125, overflowY: "scroll" }}>
              {this.state.results.stream.map((stream: Stream) => (
                <Link
                  to={{
                    pathname: `/stream/${stream.id}`,
                    state: { stream: stream },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={this.onSelect}
                    width="100%"
                    direction="row"
                    align="center"
                    gap="xsmall"
                    pad="xsmall"
                    focusIndicator={false}
                    hoverIndicator={true}
                    style={{
                      borderTop: "1px solid #d2d2d2",
                    }}
                  >
                    <Text color="#656565">{stream.name}</Text>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        )}
        {this.state.results.video.length !== 0 && (
          <Box>
            <Box
              background="#f5f5f5"
              width="100%"
              pad="xsmall"
              style={{
                borderTop: "1px solid #d2d2d2",
                borderBottom: "1px solid #d2d2d2",
              }}
            >
              <Text weight="bold" size="14px">
                Previous streams
              </Text>
            </Box>
            <Box style={{ maxHeight: 125, overflowY: "scroll" }}>
              {this.state.results.video.map((video: Video) => (
                <Link
                  to={{
                    pathname: `/video/${video.id}`,
                    state: { video },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={this.onSelect}
                    width="100%"
                    pad="xsmall"
                    focusIndicator={false}
                    hoverIndicator={true}
                    style={{
                      borderTop: "1px solid #d2d2d2",
                    }}
                  >
                    <Box direction="row" gap="xsmall" align="center">
                      <Box
                        height="15px"
                        width="15px"
                        round="7.5px"
                        overflow="hidden"
                      >
                        {!video.has_avatar && (
                          <Identicon string={video.channel_name} size={15} />
                        )}
                        {!!video.has_avatar && (
                          <img
                            src={`/images/channel-icons/${video.channel_id}.jpg`}
                          />
                        )}
                      </Box>
                      <Text size="14px" color={video.channel_colour}>
                        {video.channel_name}
                      </Text>
                    </Box>
                    <Text color="#656565">{video.name}</Text>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        )}
        {this.state.results.scheduledStream.length !== 0 && (
          <Box>
            <Box
              background="#f5f5f5"
              width="100%"
              pad="xsmall"
              style={{
                borderTop: "1px solid #d2d2d2",
                borderBottom: "1px solid #d2d2d2",
              }}
            >
              <Text weight="bold" size="14px">
                Upcoming streams
              </Text>
            </Box>
            <Box style={{ maxHeight: 125, overflowY: "scroll" }}>
              {this.state.results.scheduledStream.map(
                (scheduledStream: ScheduledStream) => (
                  <Link
                    to={{
                      pathname: `/`,
                      //   state: { video },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      onClick={this.onSelect}
                      width="100%"
                      pad="xsmall"
                      focusIndicator={false}
                      hoverIndicator={true}
                      style={{
                        borderTop: "1px solid #d2d2d2",
                      }}
                    >
                      <Box direction="row" gap="xsmall" align="center">
                        <Box
                          height="15px"
                          width="15px"
                          round="7.5px"
                          overflow="hidden"
                        >
                          {!scheduledStream.has_avatar && (
                            <Identicon
                              string={scheduledStream.channel_name}
                              size={15}
                            />
                          )}
                          {!!scheduledStream.has_avatar && (
                            <img
                              src={`/images/channel-icons/${scheduledStream.channel_id}.jpg`}
                            />
                          )}
                        </Box>
                        <Text
                          size="14px"
                          color={scheduledStream.channel_colour}
                        >
                          {scheduledStream.channel_name}
                        </Text>
                      </Box>
                      <Text color="#656565">{scheduledStream.name}</Text>
                    </Box>
                  </Link>
                )
              )}
            </Box>
          </Box>
        )}
        {this.state.results.tag.length !== 0 && (
          <Box>
            <Box
              background="#f5f5f5"
              width="100%"
              pad="xsmall"
              style={{
                borderTop: "1px solid #d2d2d2",
                borderBottom: "1px solid #d2d2d2",
              }}
            >
              <Text weight="bold" size="14px">
                Tags
              </Text>
            </Box>
            <Box style={{ maxHeight: 125, overflowY: "scroll" }}>
              {this.state.results.tag.map((tag: Tag) => (
                <Link
                  to={{
                    pathname: `/tag/${tag.name}`,
                    //   state: { video },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={this.onSelect}
                    width="100%"
                    pad="xsmall"
                    focusIndicator={false}
                    hoverIndicator={true}
                    style={{
                      borderTop: "1px solid #d2d2d2",
                    }}
                  >
                    <Text color="#656565">{tag.name}</Text>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        )}
        {this.areResultsEmpty() &&
          !this.state.loading &&
          this.state.searchString !== "" && (
            <Box>
              <Text>No results</Text>
            </Box>
          )}
      </Menu>
    );
  };

  render() {
    console.log(this.state.results);
    return (
      <Dropdown
        overlay={this.menu()}
        trigger={["click"]}
        // overlayStyle={{ width: 250 }}
        visible={this.state.searchString !== ""}
      >
        <Box>
          <TextInput
            value={this.state.searchString}
            onChange={(e) => this.search(e.target.value)}
            icon={<Search />}
            reverse
            placeholder="search ..."
            style={{ width: "27vw", height: "4.5vh", justifySelf: "center" }}
          />
        </Box>
      </Dropdown>
    );
  }
}
