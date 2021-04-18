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
// import GlobalClassification from "../../Components/Homepage/GlobalClassification";
import MediaQuery from "react-responsive";
import TopicSelector from "./TopicSelector";

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
  allTopics: Topic[];
  chosenTopic: Topic;
  chosenSubtopics: Topic[];
  audienceLevel: string[];
  allAudienceLevels: string[];
}

var emptyTopic = {
  field: "-",
  id: -1,
  is_primitive_node: false,
  parent_1_id: -1,
  parent_2_id: -1,
  parent_3_id: -1,
}

export default class TopicTalkList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      allTalks: [],
      allTopics: [],
      chosenTopic: emptyTopic,
      chosenSubtopics: [],
      audienceLevel: [],
      allAudienceLevels: ["General audience", "Bachelor/Master", "PhD+"],
    };
  }

  componentWillMount() {
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ allTopics });
    });

    TalkService.getAvailableFutureTalks(
      100, 
      0, 
      this.props.user ? this.props.user.id : null,  
      (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
      });
    });
  }

  /*
  filterChosenTalksByAudience = () => {
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
  }; */

  getTalksByTopicsAndAudience = (talks: Talk[], topicsId: number[], audienceLevel: string[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      for (let topic of talk.topics) {
        if (!isIn && topicsId.includes(topic.id) && audienceLevel.includes(talk.audience_level)) {
          isIn = true;
          res.push(talk);
        }
      }
    }
    return res;
  };

  getTalksByAudience = (talks: Talk[], audienceLevel: string[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      if (!isIn && audienceLevel.includes(talk.audience_level)) {
          isIn = true;
          res.push(talk);
      }
    } 
    return res;
  };

  getChildren = (topic: Topic) => {
    return this.state.allTopics
      .filter(function (temp: Topic) {
        return (
          temp.parent_1_id == topic.id ||
          temp.parent_2_id == topic.id ||
          temp.parent_3_id == topic.id
        );
      });
  };

  getPrimitiveNodes = () => {
    return this.state.allTopics
      .filter(function (topic: any) {
        return topic.is_primitive_node;
      });
  };

  updateAudienceLevel = (txt: string) => {
    if (this.state.audienceLevel.includes(txt)) {
      this.setState(prevState => ({
        audienceLevel: prevState.audienceLevel.filter(e => e != txt)
      }))
    } else {
      this.setState(prevState => ({
        audienceLevel: prevState.audienceLevel.concat(txt)
      }))
    }
    this.fetchFilteredTalks()
  }

  updateTopic = (topic: Topic) => {
    if (this.state.chosenTopic === topic) {
      let empty = {
        field: "-",
        id: -1,
        is_primitive_node: false,
        parent_1_id: -1,
        parent_2_id: -1,
        parent_3_id: -1,
      }
      this.setState({
        chosenTopic: empty, 
        chosenSubtopics: []
      })
    } else {
      this.setState({chosenTopic: topic, chosenSubtopics: []})
    }
    this.fetchFilteredTalks()
  }

  updateSubtopics = (topic: Topic) => {
    if (this.state.chosenSubtopics.length === 0) {
      this.setState({ chosenSubtopics: [topic] })
    }
    if (this.state.chosenSubtopics.includes(topic)) {
      let subtopics = this.state.chosenSubtopics.filter(e => e.id !== topic.id)
      this.setState({ chosenSubtopics: subtopics })
    } else {
      let subtopics = this.state.chosenSubtopics.concat(topic)
      this.setState({ chosenSubtopics: subtopics })
    }
    
  }

  getIdTopicsToFetch = () => {
    if (this.state.chosenTopic.field === "-") {
      return []
    } else if (this.state.chosenSubtopics.length === 0) {
      return this.getChildren(this.state.chosenTopic).map(topic => topic.id).concat(this.state.chosenTopic.id)
    } else {
      return this.state.chosenSubtopics.map(topic => topic.id)
    }
  }


  fetchFilteredTalks = () => {
    let topicsId = this.getIdTopicsToFetch()
    let audienceLevel = this.state.audienceLevel.length > 0 ? this.state.audienceLevel : this.state.allAudienceLevels
    if (topicsId.length > 0) {
      return this.getTalksByTopicsAndAudience(this.state.allTalks, topicsId, audienceLevel)
    } else {
      return this.getTalksByAudience(this.state.allTalks, audienceLevel)
    }
  };

  selectTopicMobile = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
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
        {this.props.past &&
          this.fetchFilteredTalks().map((talk: Talk) => (
            <PastTalkCard
              talk={talk}
              user={this.props.user}
              onSave={this.props.onSave}
              onUnsave={this.props.onUnsave}
            />
          ))}
        {!this.props.past &&
          this.fetchFilteredTalks().map((talk: Talk) => (
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
        width="280px"
        margin="none"
        pad="small"
        justify="between"
        round="xsmall"
        align="center"
        alignSelf="center"
        background="#EEEEEE"
      >
        <Text size="12px" weight="bold" color="grey">
          Currently no public talks in that category
        </Text>
      </Box>
    );
  };

  render() {
    return (
      <Box width="100%" margin={{"bottom": "50px"}}>
        <Box
          width="100%"
          direction="row"
          gap="medium"
          align="end"
          margin={{ bottom: "15px" }}
        >
          {this.props.title && (
            <Text size="24px" weight="bold" color="black" margin="5px">
              Upcoming talks
            </Text>
          )}

        </Box>

        {/* A. Classification system for desktop */}
        <MediaQuery minDeviceWidth={992}>
          <Box 
            width="97.5%" 
            margin={{"bottom": "50px", "left": "5px"}}
            background="#EEEEEE"
            direction="row"
            pad="12px"
            round="xsmall"
          >
            <Box direction="column" width="25%">
              <Text size="12px" weight="bold" margin={{bottom: "10px"}}> 
                Topic
              </Text>
              {this.getPrimitiveNodes().map((topic: Topic) =>
                <Box
                  onClick={() => {this.updateTopic(topic)}}
                  background={"white"} 
                  border={this.state.chosenTopic === topic ? {color: "#0C385B", size: "2px"} : {size: "0px"}}
                  round="xsmall"
                  pad="5px"
                  width="80%"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  margin="3px"
                  hoverIndicator="#DDDDDD"
                >
                  <Text size="12px">
                    {topic.field}
                  </Text>
                </Box>
              )}
            </Box> 

            <Box direction="column" width="25%">
              <Text size="12px" weight="bold" margin={{bottom: "10px"}}> 
                Sub-topics
              </Text>
              {this.state.chosenTopic.field === "-" && (
                <Text size="12px" style={{fontStyle: "italic"}}> 
                  Select a topic to display its subtopics 
                </Text>
              )}
              {this.state.chosenTopic.field !== "-" && (
                this.getChildren(this.state.chosenTopic).slice(0, 7).map((topic: Topic) =>
                  <Box
                    onClick={() => {this.updateSubtopics(topic)}}
                    background={this.state.chosenSubtopics.includes(topic) ? "#0C385B" : "white"} 
                    round="xsmall"
                    pad="5px"
                    width="90%"
                    justify="center"
                    align="center"
                    focusIndicator={false}
                    margin="3px"
                    hoverIndicator="#DDDDDD"
                  >
                    <Text size="12px">
                      {topic.field}
                    </Text>
                  </Box>
                )
              )}

            </Box> 

            <Box direction="column" width="25%" margin={{top: "24px", right: "60px"}}>
              {this.state.chosenTopic.field !== "-" && (
                this.getChildren(this.state.chosenTopic).slice(7).map((topic: Topic) =>
                  <Box
                    onClick={() => {this.updateSubtopics(topic)}}
                    background={this.state.chosenSubtopics.includes(topic) ? "#0C385B" : "white"} 
                    round="xsmall"
                    pad="5px"
                    width="90%"
                    justify="center"
                    align="center"
                    focusIndicator={false}
                    margin="3px"
                    hoverIndicator="#DDDDDD"
                  >
                    <Text size="12px">
                      {topic.field}
                    </Text>
                  </Box>
                )
              )}

            </Box> 

            <div id="vertical-line"> {} </div>

            <Box direction="column" width="20%">
              <Text size="12px" weight="bold" margin={{bottom: "10px"}}> 
                Audience level  
              </Text>
              {this.state.allAudienceLevels.map((txt: string) =>
                <Box
                  onClick={() => {this.updateAudienceLevel(txt)}}
                  background={this.state.audienceLevel.includes(txt) ? "#0C385B" : "white"} 
                  round="xsmall"
                  pad="5px"
                  width="90%"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  margin="3px"
                  hoverIndicator="#DDDDDD"
                >
                  <Text size="12px">
                    {txt}
                  </Text>
                </Box>
              )}
            </Box> 
          </Box>
        </MediaQuery>

        {/* B. Classification system for mobile */}
        <MediaQuery maxDeviceWidth={992}>
          <TopicClassification 
            topicCallback={this.selectTopicMobile}
            searchType="Talks"
          />
        </MediaQuery>

        {this.fetchFilteredTalks().length === 0
          ? this.ifNoTalks()
          : this.ifTalks()}

        {/*this.props.seeMore && (
          <Link to="/upcoming" style={{ textDecoration: "none" }}>
            <Box
              className="see-more-button"
              pad={{ vertical: "2px", horizontal: "xsmall" }}
              round="xsmall"
              style={{
                border: "2px solid #C2C2C2",
              }}
              direction="row"
              align="end"
            >
              <Text color="grey">See all </Text>
              <FormNextLink color="grey" />
            </Box>
          </Link>
          )*/}
      </Box>
    );
  }
}
