import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text, TextInput } from "grommet";
import { Search } from "grommet-icons";
import { Dropdown, Menu } from "antd";
import { Channel } from "../Services/ChannelService";
import { Stream } from "../Services/StreamService";
import { Video } from "../Services/VideoService";
import { Talk } from "../Services/TalkService";
import { Tag } from "../Services/TagService";
import { SearchService } from "../Services/SearchService";
import Identicon from "react-identicons";

interface State {
  searchString: string;
  loading: boolean;
  results: {
    channel: Channel[];
    stream: Stream[];
    past: Talk[];
    upcoming: Talk[];
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
      past: [],
      upcoming: [],
      tag: [],
    };
  };

  areResultsEmpty = () => {
    const arrs = Object.values(this.state.results);
    for (let i in arrs) {
      if (arrs[i] && arrs[i].length !== 0) {
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
        ["channel", "upcoming", "past", "tag", "stream"],
        this.state.searchString,
        (results: {
          channel: Channel[];
          stream: Stream[];
          upcoming: Talk[];
          past: Talk[];
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
                    pathname: `/${channel.name}`,
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
                            height={20}
                            width={20}
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
        {this.state.results.stream && this.state.results.stream.length !== 0 && (
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
        {this.state.results.past.length !== 0 && (
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
                Previous talks
              </Text>
            </Box>
            <Box style={{ maxHeight: 125, overflowY: "scroll" }}>
              {this.state.results.past.map((talk: Talk) => (
                <Link
                  to={{
                    pathname: "/",
                    // state: {  },
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
                        {!talk.has_avatar && (
                          <Identicon string={talk.channel_name} size={15} />
                        )}
                        {!!talk.has_avatar && (
                          <img
                            src={`/images/channel-icons/${talk.channel_id}.jpg`}
                            height={15}
                            width={15}
                          />
                        )}
                      </Box>
                      <Text size="14px" color={talk.channel_colour}>
                        {talk.channel_name}
                      </Text>
                    </Box>
                    <Text color="#656565">{talk.name}</Text>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        )}
        {this.state.results.upcoming.length !== 0 && (
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
                Upcoming talks
              </Text>
            </Box>
            <Box style={{ maxHeight: 125, overflowY: "scroll" }}>
              {this.state.results.upcoming.map((talk: Talk) => (
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
                        {!talk.has_avatar && (
                          <Identicon string={talk.channel_name} size={15} />
                        )}
                        {!!talk.has_avatar && (
                          <img
                            src={`/images/channel-icons/${talk.channel_id}.jpg`}
                            height={15}
                            width={15}
                          />
                        )}
                      </Box>
                      <Text size="14px" color={talk.channel_colour}>
                        {talk.channel_name}
                      </Text>
                    </Box>
                    <Text color="#656565">{talk.name}</Text>
                  </Box>
                </Link>
              ))}
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
            placeholder="Search..."
            style={{ width: "27vw", height: "4.5vh", justifySelf: "center" }}
          />
        </Box>
      </Dropdown>
    );
  }
}
