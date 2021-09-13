import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "../Core/Loading";
import { TalkService } from "../../Services/TalkService";
import { ChannelService } from "../../Services/ChannelService";
import Identicon from "react-identicons";
import "../../Styles/trending-channels-box.css";
import { Multiple } from "grommet-icons";
import AgoraLogo from "../../assets/general/agora_logo_v2.1.svg";
import ReactTooltip from "react-tooltip";





type TrendingTalk = {
    id: number;
    Channels: {
        id: number}; // NOT WORKING
    channel_name: string;
    has_avatar: boolean;
    name: string;
  };



interface State {
  trendingTalks: TrendingTalk[];
  loading: boolean;
}


export default class TrendingTalksList extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
        trendingTalks: [],
        loading: true,
    };
  }

  componentWillMount() {
    TalkService.getTrendingTalks((trendingTalks: any[]) => {
      this.setState({
        trendingTalks: trendingTalks,
        loading: false,
      }, ()=>{
      });
    });
  }
  render() {
    return (
      <Box height="250px">
        <Box direction="row" justify="start" style={{minWidth: "50%"}} margin={{bottom: "10px"}}>
          <ReactTooltip id="what-is-an-agora" effect="solid">
          An agora is a hub for a community -- reading group, seminar group, institution, ...
          </ReactTooltip>
          <Text
            size="26px"
            alignSelf="start"
            weight="bold"
          >
            Trending seminars
          </Text>

        </Box>
        {this.state.loading && (
          <Box width="100%" height="80%" justify="center" align="center">
            <Loading color="color1" size={50} />
          </Box>
        )}
        <Box margin={{ bottom: "15px", left:"8px" }} overflow="auto">
          {this.state.trendingTalks.map((trendingTalk: any) => (
            <Link
              className="channel"
              to={`/event/${trendingTalk.id}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                direction="row"
                gap="xsmall"
                // align="center"
                pad={{ vertical: "3.5px" }}
              >
                <Box
                  background="white"
                  justify="center"
                  align="center"
                  overflow="hidden"
                  style={{
                    minHeight: 30,
                    minWidth: 30,
                    maxHeight: 30,
                    maxWidth: 30,
                    borderRadius: 15,
                  }}
                >
                <img
                    src={ChannelService.getAvatar(trendingTalk["Channels.id"])}
                    height={30}
                    width={30}
                />
                </Box>
                <Box justify="center">
                  <Text size="14px" color="color1" weight="bold">
                    {trendingTalk.name}
                  </Text>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
        {/* <Link
          to={{ pathname: "/agoras" }}
          style={{ textDecoration: "none" }}
        >
          <Box
            onClick={() => ({})}
            direction="row"
            background="#EAF1F1"
            round="xsmall"
            pad="small"
            gap="xsmall"
            height="40px"
            width="250px"
            align="center"
            focusIndicator={false}
            hoverIndicator="#BAD6DB"
          >
            <Multiple size="25px" />
            <Text size="14px" weight="bold" margin={{left: "2px"}}> 
              Discover more <img src={AgoraLogo} style={{ height: "12px", marginTop: "1px", marginRight: "-1px"}}/>s 
            </Text>
          </Box>
        </Link> */}
      </Box>
    );
  }
}
