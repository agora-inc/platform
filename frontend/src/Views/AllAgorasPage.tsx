import React, { useState, useEffect, Component } from "react";
import { Box, Button, Text } from "grommet";
import { Link } from "react-router-dom";
import { Channel, ChannelService } from "../Services/ChannelService";
import { User } from "../Services/UserService";
import { Topic, TopicService } from "../Services/TopicService";
import MoraFlexibleGrid from "../Components/Core/MoraFlexibleGrid";
import TopicClassification from "../Components/Homepage/TopicClassification";
import ChannelAgoraCard from "../Components/Channel/ChannelAgoraCard";
import "../Styles/all-agoras-page.css";
import agoraLogo from "../assets/general/agora_logo_v2.1.svg";

/*const AllAgorasPage = () => {
  const [agoras, setAgoras] = useState<Channel[]>([]);

  useEffect(() => {
    ChannelService.getAllChannels(100, 0, setAgoras);
  }, []);

  return (
    <div className="all-agoras-page">
      <span className="all-agoras-title">All agoras</span>
      <div className="all-agoras-grid">
        {agoras.map((agora) => (
          <Link className="agora-card" to={`/${agora.name}`}>
            <div
              className="agora-card-banner"
              style={{ background: agora.colour }}
            >
              {
                <img
                  src={ChannelService.getCover(agora.id, Math.floor(new Date().getTime() / 45000))}
                  width={420}
                  height={140}
                />
              }
            </div>
            <div className="avatar-and-name">
              <div className="agora-card-avatar">
                <img
                  src={ChannelService.getAvatar(agora.id, Math.floor(new Date().getTime() / 45000))}
                  height={30}
                  width={30}
                />
              </div>
              <span className="agora-card-name">{agora.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllAgorasPage;*/

interface Props {
  gridArea?: string;
  onSave?: any;
  onUnsave?: any;
  seeMore: boolean;
  title: boolean;
  topicSearch: boolean;
  user: User | null;
}

interface State {
  allAgoras: Channel[];
  chosenAgoras: Channel[];
  allTopics: Topic[];
  chosenTopic: Topic;
  isMobile: boolean;
  isSmallScreen: boolean;
  windowWidth: number;
}

export default class AllAgorasPage extends Component<Props, State> {
  private smallScreenBreakpoint: number;
  private mobileScreenBreakpoint: number;
  constructor(props: Props) {
    super(props);
    this.mobileScreenBreakpoint = 992;
    this.smallScreenBreakpoint = 480;
    this.state = {
      allAgoras: [],
      chosenAgoras: [],
      allTopics: [],
      chosenTopic: {
        field: "-",
        id: -1,
        is_primitive_node: false,
        parent_1_id: -1,
        parent_2_id: -1,
        parent_3_id: -1,
      },
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    };
  }

  updateResponsiveSettings = () => {
    this.setState({
      isMobile: window.innerWidth < this.mobileScreenBreakpoint,
      isSmallScreen: window.innerWidth < this.smallScreenBreakpoint,
      windowWidth: window.innerWidth,
    });
  };

  componentWillMount() {
    window.addEventListener("resize", this.updateResponsiveSettings);
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ allTopics: allTopics });
    });

    ChannelService.getAllChannels(100, 0, (allAgoras: Channel[]) => {
      this.setState({
        allAgoras: allAgoras,
        chosenAgoras: allAgoras,
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateResponsiveSettings);
  }

  /*getAgorasByTopics = (channels: Channel[], topicsId: number[]): Channel[] => {
    let res: Channel[] = [];
    for (let channel of channels) {
      let isIn: boolean = false;
      if(channel.topics) {
        for (let topic of channel.topics) {
          if (!isIn && topicsId.includes(topic.id))  {
            isIn = true;
            res.push(channel);
          }
        }
      }
    }
    return res;
  };*/

  fetchAgorasByTopic = (topic: Topic) => {
    if (topic.id >= 0) {
      let childrenId = TopicService.getDescendenceId(
        topic,
        this.state.allTopics
      );
      childrenId.push(topic.id);
      ChannelService.getChannelsWithTopic(
        100,
        topic.id,
        0,
        (foundAgoras: Channel[]) => {
          this.setState({
            chosenAgoras: foundAgoras,
          });
        }
      );
    } else {
      this.setState({
        chosenAgoras: this.state.allAgoras,
      });
    }
  };

  selectTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
    this.fetchAgorasByTopic(temp);
  };

  ifAgoras = () => {
    let childElements: React.ReactNode[] = this.state.chosenAgoras
      .filter((agora: Channel) => {
        return !["mora", "agora"].some((x) =>
          agora.name.toLowerCase().includes(x)
        );
      })
      .map((agora: Channel, index: number) => (
        <ChannelAgoraCard
          agora={agora}
          channelCoverImage={ChannelService.getCover(
            agora.id,
            Math.floor(new Date().getTime() / 45000)
          )}
          channelAvatar={ChannelService.getAvatar(
            agora.id,
            Math.floor(new Date().getTime() / 45000)
          )}
          windowWidth={this.state.windowWidth}
          key={index}
        />
      ));
    return (
      <Box
        width="100%"
        gap="small"
        direction="row"
        height="100%"
        wrap
        margin={{ top: "24px" }}
      >
        <MoraFlexibleGrid
          windowWidth={this.state.windowWidth}
          gridBreakpoints={[
            { screenSize: 1850, columns: 4 },
            { screenSize: 1500, columns: 3 },
            { screenSize: 960, columns: 2 },
            { screenSize: 600, columns: 1 },
          ]}
          gap={10}
          childElements={childElements}
          align="center"
        />
      </Box>
    );
  };

  ifNoAgoras = () => {
    return (
      <Box
        direction="row"
        width="100%"
        margin="none"
        pad="small"
        justify="between"
        round="xsmall"
        align="center"
        alignSelf="center"
        background="#F3EACE"
      >
        <Text size="18px" weight="bold" color="grey">
          No public Agoras in that category
        </Text>
      </Box>
    );
  };

  render() {
    return (
      <>
        {/* <video
        autoPlay loop muted id="background-landing"
        style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
      >
      <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4"/>
      </video> */}
        <img
          style={{
            height: "auto",
            width: "auto",
            minWidth: "100%",
            minHeight: "100%",
          }}
          id="background-landing"
          src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
        />
        <div className="all-agoras-page">
          <Text weight="bold" size="28px" margin={{ bottom: "15px" }}>
            Discover new{" "}
            <img src={agoraLogo} height="20px" style={{ offset: "50px" }} />s
          </Text>
          <TopicClassification
            topicCallback={this.selectTopic}
            searchType="Agoras"
          />

          {this.state.chosenAgoras.length === 0
            ? this.ifNoAgoras()
            : this.ifAgoras()}
        </div>
      </>
    );
  }
}
