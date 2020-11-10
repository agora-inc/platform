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
  }
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
      }
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
  };

  selectTopic = (temp: Topic) => {
    this.setState({
      chosenTopic: temp,
    });
    this.fetchTalksByTopicWithChildren(temp);
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
        <Box
          width="100%"
          direction="row"
          gap="medium"
          align="end"
          margin={{ bottom: "15px" }}
        >
          {this.props.title && (
            <Box direction="row" width="100%">
              <Box width="50%">
                <Text size="24px" weight="bold" color="black" margin="5px">
                  Upcoming talks
                </Text>
              </Box>
              <Box direction="row" width="50%">
                <Box
                  onClick={() => {
                    this.setState({audienceLevel: 
                      {...this.state.audienceLevel, GeneralAudience: !this.state.audienceLevel.GeneralAudience, all: false}}, () => {
                        this.selectTopic(this.state.chosenTopic);
                      console.log("value of the chosenTopic:", this.state.chosenTopic)})}}
                  background={this.state.audienceLevel.GeneralAudience ? "#E0E0E0" : "white"} 
                  round="xsmall"
                  pad={{ bottom: "4px", top: "4px", left: "18px", right: "18px" }}
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  style={{
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={false}
                  >
                    {this.state.audienceLevel.GeneralAudience && (
                      <Text weight="bold" size="small">
                        General Audience
                      </Text>)
                    }
                    {!this.state.audienceLevel.GeneralAudience && (
                      <Text size="small">
                        General Audience
                      </Text>)
                    }
                  </Box>
                <Box
                  onClick={() => {
                    this.setState({audienceLevel: 
                      {...this.state.audienceLevel, BachelorMaster: !this.state.audienceLevel.BachelorMaster, all: false}}, () => {
                    this.selectTopic(this.state.chosenTopic)})}}
                  background={this.state.audienceLevel.BachelorMaster ? "#E0E0E0" : "white"} 
                  round="xsmall"
                  pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  style={{
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={false}
                  >
                    {this.state.audienceLevel.BachelorMaster && (
                      <Text weight="bold" size="small">
                        Bachelor/Master
                      </Text>)
                    }
                    {!this.state.audienceLevel.BachelorMaster && (
                      <Text size="small">
                        Bachelor/Master
                      </Text>)
                    }
                  </Box>
                <Box
                  onClick={() => {
                    this.setState({audienceLevel: {...this.state.audienceLevel, Phdplus: !this.state.audienceLevel.Phdplus, all: false}}, () => {
                      this.selectTopic(this.state.chosenTopic)})}}
                  background={this.state.audienceLevel.Phdplus ? "#E0E0E0" : "white"} 
                  round="xsmall"
                  pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  style={{
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={false}>
                  {this.state.audienceLevel.Phdplus && (
                    <Text weight="bold" size="small">
                      PhD+
                    </Text>)
                  }
                  {!this.state.audienceLevel.Phdplus && (
                    <Text size="small">
                      PhD+
                    </Text>)
                  }
                  </Box>
                  <Box
                  onClick={() => {
                    this.setState({audienceLevel: 
                      {
                        all: true, 
                        GeneralAudience: true,
                        BachelorMaster: true,
                        Phdplus: true
                      }}, () => {
                        this.selectTopic(this.state.chosenTopic)
                      })}}
                  background="white"
                  round="xsmall"
                  pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  style={{
                    border: "1px solid #C2C2C2",
                  }}
                  hoverIndicator={true}
                  >
                    <Text size="small">
                      All
                    </Text>
                  </Box>
                </Box>
                </Box>
          )}
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

        {this.props.topicSearch && (
          <TopicClassification 
            topicCallback={this.selectTopic} 
            />
        )}

        {this.state.chosenTalks.length === 0
          ? this.ifNoTalks()
          : this.ifTalks()}
      </Box>
    );
  }
}
