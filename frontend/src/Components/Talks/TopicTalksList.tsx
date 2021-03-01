import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Text } from "grommet";
import TalkCard from "./TalkCard";
import PastTalkCard from "./PastTalkCard";
import { Talk, TalkService } from "../../Services/TalkService";
import { FormNextLink } from "grommet-icons";
import "../../Styles/home.css";
import "../../Styles/see-more-button.css";
import "../../Styles/topic-talks-list.css";
import { User } from "../../Services/UserService";
import { Topic, TopicService } from "../../Services/TopicService";
import TopicClassification from "../../Components/Homepage/TopicClassification";
import MediaQuery from "react-responsive";
import TalkClassificationBar from "../Core/talkClassificationBar";

interface Props {
  gridArea?: string;
  past?: boolean;
  onSave?: any;
  onUnsave?: any;
  seeMore: boolean;
  title: boolean;
  topicSearch: boolean;
  user: User | null;
}

interface State {
  allTalks: Talk[];
  chosenTalks: Talk[];
  allTopics: Topic[];
  chosenTopic: Topic;
  audienceLevel: {
    GeneralAudience: boolean,
    BachelorMaster: boolean,
    Phdplus: boolean,
    all: boolean
  };
  chosenAudience: string,
  chosenVisibility: string,
}

export default class TopicTalkList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allTalks: [],
      chosenTalks: [],
      allTopics: [],
      chosenTopic: {
        field: "-",
        id: -1,
        is_primitive_node: false,
        parent_1_id: -1,
        parent_2_id: -1,
        parent_3_id: -1,
      },
      audienceLevel: {
        GeneralAudience: true,
        BachelorMaster: true,
        Phdplus: true,
        all: true
      },
      chosenAudience: "",
      chosenVisibility: "",
    };
  }

  componentWillMount() {
    if (this.props.topicSearch) {
      TopicService.getAll((allTopics: Topic[]) => {
        this.setState({ allTopics: allTopics });
      });
    }

    // Limit to 1000 talks
    /*
    TalkService.getAllFutureTalks(1000, 0, (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
        chosenTalks: allTalks,
      });
    });
    */
    
    TalkService.getAvailableFutureTalks(
      50, 
      0, 
      this.props.user ? this.props.user.id : null,  
      (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
        chosenTalks: allTalks,
      });
    });
  }

  /*filterChosenTalksByAudience = () => {
    let filteredTopics = []
    if (!(this.state.audienceLevel.all)){
    for (let talk of this.state.allTalks){
      if ((this.state.audienceLevel.GeneralAudience && talk.audience_level === "General audience" ) ||
        (this.state.audienceLevel.BachelorMaster && talk.audience_level === "Bachelor/Master" ) ||
        (this.state.audienceLevel.Phdplus && talk.audience_level === "PhD+") 
      )
        {
        filteredTopics.push(talk);
      }
    };
    this.setState({chosenTalks: filteredTopics});
    }
  };

  getTalksByTopicsAndAudience = (talks: Talk[], topicsId: number[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      for (let topic of talk.topics) {
        if ((!isIn && topicsId.includes(topic.id)) &&
        ((this.state.audienceLevel.GeneralAudience && talk.audience_level === "General audience" ) ||
        (this.state.audienceLevel.BachelorMaster && talk.audience_level === "Bachelor/Master" ) ||
        (this.state.audienceLevel.Phdplus && talk.audience_level === "PhD+")))  {
          isIn = true;
          res.push(talk);
        }
      }
    }
    return res;
  };

  getTalksByAudience = (talks: Talk[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      if ((this.state.audienceLevel.GeneralAudience && talk.audience_level === "General audience" ) ||
        (this.state.audienceLevel.BachelorMaster && talk.audience_level === "Bachelor/Master" ) ||
        (this.state.audienceLevel.Phdplus && talk.audience_level === "PhD+"))  {
          res.push(talk);
        }
      } 
    return res;
  };

  fetchTalksByTopicWithChildren = (topic: Topic) => {
    if (topic.id >= 0) {
      let childrenId = TopicService.getDescendenceId(
        topic,
        this.state.allTopics
      );
      childrenId.push(topic.id);
      this.setState({
        chosenTalks: this.getTalksByTopicsAndAudience(this.state.allTalks, childrenId),
      });
    } else {
      this.setState({
        chosenTalks: this.getTalksByAudience(this.state.allTalks)
      });
    }
    // this.filterChosenTalksByAudience();
  };*/

  fetchTalksFromFilters(audience: string, topic1Id: number, topic2Id: number, visibility: string, userId: number) {
    let sqlAudience: string = "*";
    let sqlTopic1Id: number = -1;
    let sqlTopic2Id: number = -1;
    let sqlVisibility: string = "*";

    if (audience != "All" || "" || undefined ||null) {
      sqlAudience = audience
    }  
    if (topic1Id != -1 || 0 || null) {
      sqlTopic1Id = topic1Id
    }
    if (topic2Id != -1 || 0 || null) {
      sqlTopic2Id = topic2Id
    }
    if (visibility != "All" || "" || undefined || null) {
      sqlVisibility = visibility
    }
    TalkService.getFilteredTalks(
      sqlAudience, 
      topic1Id, 
      topic2Id, 
      sqlVisibility,
      userId, 
      (chosenTalks: Talk[]) => {
        this.setState({
          chosenTalks: chosenTalks,
        });
      }
    )
  }

  /*selectTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
    this.fetchTalksByTopicWithChildren(temp);
  };*/
  setTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
  }
  setAudience = (temp: string) => {
    this.setState({
      chosenAudience: temp,
    });
    this.fetchTalksFromFilters(
      this.state.chosenVisibility,
      this.state.chosenTopic.parent_1_id!,
      this.state.chosenTopic.parent_2_id!,
      temp, 
      this.props.user!.id,
    )
  }
  setVisibility = (temp: string) => {
    this.setState({
      chosenVisibility: temp,
    });
    this.fetchTalksFromFilters(
      temp, 
      this.state.chosenTopic.parent_1_id!,
      this.state.chosenTopic.parent_2_id!, 
      this.state.chosenAudience, 
      this.props.user!.id
    )
  }

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
        {this.props.past &&
          this.state.chosenTalks.map((talk: Talk) => (
            <PastTalkCard
              talk={talk}
              user={this.props.user}
              onSave={this.props.onSave}
              onUnsave={this.props.onUnsave}
            />
          ))}
        {!this.props.past &&
          this.state.chosenTalks.map((talk: Talk) => (
            <TalkCard talk={talk} user={this.props.user} />
          ))}
      {/* </Box> */}
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
          There are no talks in that category
        </Text>
      </Box>
    );
  };

  render() {

    return (
      <Box width="100%" margin={{"bottom": "50px"}}>
        
        <Text size="24px" weight="bold" color="black" margin="5px">
          Upcoming Talks
        </Text>

        {this.props.topicSearch && (
          <TalkClassificationBar
            user={this.props.user}
            talkPast={false}
            topicCallback={this.setTopic}
            audienceCallback={this.setAudience}
            visibilityCallback={this.setVisibility} 
            />
        )}

        {this.state.chosenTalks.length === 0
          ? this.ifNoTalks()
          : this.ifTalks()}
      </Box>
    );
  }
}
