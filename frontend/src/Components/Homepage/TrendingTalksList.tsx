import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Loading from "../Core/Loading";
import { Talk, TalkService } from "../../Services/TalkService";
import Identicon from "react-identicons";
import "../../Styles/trending-channels-box.css";
import { Multiple } from "grommet-icons";
import AgoraLogo from "../../assets/general/agora_logo_v2.1.png";
import ReactTooltip from "react-tooltip";





type trendingTalk = {
    id: number;
    channel_id: number;
    channel_name: string;
    has_avatar: boolean;
    name: string;
  };



interface State {
  trendingTalks: trendingTalk[];
  loading: boolean;
}



// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)
// WIP (Remy)








export default class TrendingTalksList extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
        trendingTalks: [],
        loading: true,
    };
  }

  componentWillMount() {
    TalkService.getTrendingTalks((trendingTalks: trendingTalk[]) => {
      this.setState({
        trendingTalks: trendingTalks,
        loading: false,
      });
    });
  }
  render() {
      console.log("wesh")
      console.log(this.state.trendingTalks)
    return (
        <>
        </>
    //   <Box height="290px">
    //     <Box direction="row" justify="start" style={{minWidth: "50%"}} margin={{bottom: "21px"}}>
    //       <ReactTooltip id="what-is-an-agora" effect="solid">
    //       An agora is a hub for a community -- reading group, seminar group, institution, ...
    //       </ReactTooltip>
    //       <Text
    //         size="21px"
    //         margin={{ left: "small" }}
    //         alignSelf="start"
    //         weight="bold"
    //       >
    //         Trending talks
    //       </Text>
    //       {/* <Link to="/agoras" style={{ fontSize: 12, marginLeft: 15 }}>
    //         <Box
    //           className="see-more-button"
    //           pad={{ vertical: "2px", horizontal: "xsmall" }}
    //           round="xsmall"
    //           style={{
    //             border: "2px solid #C2C2C2",
    //           }}
    //           direction="row"
    //           align="end"
    //         >
    //           <Text color="grey" size="12px"> See all </Text>
    //         </Box>
    //       </Link> */}

    //     </Box>
    //     {this.state.loading && (
    //       <Box width="100%" height="80%" justify="center" align="center">
    //         <Loading color="color1" size={50} />
    //       </Box>
    //     )}
    //     <Box margin={{ bottom: "15px", left:"8px" }} overflow="auto">
    //       {this.state.talks.map((talk: Talk) => (
    //         <Link
    //           className="channel"
    //           to={`/${talk.name}`}
    //           style={{ textDecoration: "none" }}
    //         >
    //           <Box
    //             direction="row"
    //             gap="xsmall"
    //             // align="center"
    //             pad={{ vertical: "3.5px" }}
    //           >
    //             <Box
    //               background="white"
    //               justify="center"
    //               align="center"
    //               overflow="hidden"
    //               style={{
    //                 minHeight: 30,
    //                 minWidth: 30,
    //                 maxHeight: 30,
    //                 maxWidth: 30,
    //                 borderRadius: 15,
    //               }}
    //             >
    //               {!talk.has_avatar && (
    //                 <Identicon string={talk.name} size={25} />
    //               )}
    //               {!!talk.has_avatar && (
    //                 <img
    //                   src={ChannelService.getAvatar(channel.id)}
    //                   height={30}
    //                   width={30}
    //                 />
    //               )}
    //             </Box>
    //             <Box justify="center">
    //               <Text size="14px" color="color1" weight="bold">
    //                 {channel.name}
    //               </Text>
    //             </Box>
    //           </Box>
    //         </Link>
    //       ))}
    //     </Box>
    //     <Link
    //       to={{ pathname: "/agoras" }}
    //       style={{ textDecoration: "none" }}
    //     >
    //       <Box
    //         onClick={() => ({})}
    //         direction="row"
    //         background="#EAF1F1"
    //         round="xsmall"
    //         pad="small"
    //         gap="xsmall"
    //         height="40px"
    //         width="250px"
    //         align="center"
    //         focusIndicator={false}
    //         hoverIndicator="#BAD6DB"
    //       >
    //         <Multiple size="25px" />
    //         <Text size="14px" weight="bold" margin={{left: "2px"}}> 
    //           Discover more <img src={AgoraLogo} style={{ height: "12px", marginTop: "1px", marginRight: "-1px"}}/>s 
    //         </Text>
    //       </Box>
    //     </Link>
    //   </Box>
    );
  }
}
