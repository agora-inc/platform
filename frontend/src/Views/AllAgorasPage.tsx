import React, { useState, useEffect,Component } from "react";
import { Box, Button, Text } from "grommet";
import { Link } from "react-router-dom";
import { Identicon } from "react-identicons";
import { Channel, ChannelService } from "../Services/ChannelService";
import { User } from "../Services/UserService";
import { Talk, TalkService } from "../Services/TalkService";
import { Topic, TopicService } from "../Services/TopicService";
import TopicClassification from "../Components/Homepage/TopicClassification";
import MediaQuery from "react-responsive";
import "../Styles/all-agoras-page.css";

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
}

export default class AllAgorasPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
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
    };
  }

  componentWillMount() {
    
      TopicService.getAll((allTopics: Topic[]) => {
        this.setState({ allTopics: allTopics });
      });
    

    // Limit to 1000 talks
    /*
    TalkService.getAllFutureTalks(1000, 0, (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
        chosenTalks: allTalks,
      });
    });
    */
    
   ChannelService.getAllChannels(
      100, 
      0, 
      (allAgoras: Channel[]) => {
      this.setState({
        allAgoras: allAgoras,
        chosenAgoras: allAgoras,
      });
    });
  }

  getAgorasByTopics = (channels: Channel[], topicsId: number[]): Channel[] => {
    let res: Channel[] = [];
    for (let channel of channels) {
      let isIn: boolean = false;
      for (let topic of channel.topics) {
        if (!isIn && topicsId.includes(topic.id))  {
          isIn = true;
          res.push(channel);
        }
      }
    }
    return res;
  };

  fetchAgorasByTopic = (topic: Topic) => {
    if (topic.id >= 0) {
      let childrenId = TopicService.getDescendenceId(
        topic,
        this.state.allTopics
      );
      childrenId.push(topic.id);
      this.setState({
        chosenAgoras: this.getAgorasByTopics(this.state.allAgoras, childrenId),
      });
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

  ifTalks = () => {
    
    return (
      <div className="talk_cards_outer_box">
        {/* <Box 
        width="100%"
        gap="small"
        direction="row"
        height="100%"
        wrap
        margin={{ top: "24px" }}
        > */}
        {this.state.chosenAgoras.map((agora: Channel) => (
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
    );
  };

  ifNoTalks = () => {
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
          There are no Agoras in that category
        </Text>
      </Box>
    );
  };

  render() {

    return (
      <div className="all-agoras-page">
        <span className="all-agoras-title">Agoras</span>
        <div className="all-agoras-grid"></div>
        
        
          <TopicClassification 
            topicCallback={this.selectTopic}
            searchType="Agoras"
            />
        
        

        {this.state.chosenAgoras.length === 0
          
          
          ? this.ifNoTalks()
          : this.ifTalks()}
      </div>
    );
  }
}