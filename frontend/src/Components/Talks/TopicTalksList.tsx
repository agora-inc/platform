import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Text } from "grommet";
import TalkCard from "./TalkCard";
import PastTalkCard from "./PastTalkCard";
import { Talk, TalkService } from "../../Services/TalkService";
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
  allTopics: Topic[];
  chosenTopic: Topic;
  chosenSubtopics: Topic[];
  audienceLevel: string[];
  allAudienceLevels: string[];
  renderMobile: boolean,
  hadFirstTalkFetch: boolean,
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
      renderMobile: window.innerWidth < 800,
      hadFirstTalkFetch: false,
    };
  }

  componentDidMount() {
    document.addEventListener("scroll", this.handleScroll, true);
  }

  componentDidUnmount() {
    document.removeEventListener("scroll", this.handleScroll);
  }

  componentWillMount() {
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ allTopics });
    });

    TalkService.getAvailableFutureTalks(
      200, 
      0, 
      this.props.user ? this.props.user.id : null,  
      (allTalks: Talk[]) => {
      this.setState({
        allTalks: allTalks,
        hadFirstTalkFetch: true
      });
    });
  }

  handleScroll = (e: any) => {
    console.log(this.state.chosenSubtopics)
    var totalHeight = e.target.scrollHeight
    var scrolledFromTop = e.target.scrollTop
    var screenClientHeight = e.target.clientHeight

    var scrollingRemaining = totalHeight - scrolledFromTop
    console.log(scrollingRemaining)

    // Trigger when 1.2 times the size of screenClient is remaining
    var almostReachedBottom = ( scrollingRemaining / screenClientHeight < 1.5)
    
    if (almostReachedBottom == true && this.state.hadFirstTalkFetch == true) {
      var n_talks = 0
      // check if fetch talks by topics, subtopics, or general
      var fetchTalkByTopic = (this.state.chosenSubtopics.length == 0 && this.state.chosenTopic.id !== -1)
      var fetchTalkBySubtopic = (this.state.chosenSubtopics.length !== 0)
      
      console.log("fetchTalkByTopic:", fetchTalkByTopic)
      console.log("fetchTalkBySubtopic:", fetchTalkBySubtopic)


      // All fetches are maxed to 40
      if (fetchTalkByTopic){
        TalkService.getAllFutureTalksForTopicWithChildren(
          40, this.state.allTalks.length, this.state.chosenTopic.id, 
          (talks: Talk[]) => {
            this.setState({
              allTalks: this.state.allTalks.concat(talks)
            })
          }
          )
        } else if (fetchTalkBySubtopic){
          // NB: we only have methods to fetch for 1 subtopic at a time.
          for(let topic of this.state.chosenSubtopics){
            var fetchedTalks = []
            TalkService.getAllFutureTalksForTopicWithChildren(
              40, 
              this.state.allTalks.length, 
              topic.id,  
              (talks: Talk[]) => {
              this.setState({
                allTalks: this.state.allTalks.concat(talks)
              });
            })
          };
      } else {
        TalkService.getAllFutureTalks(
          40,
          this.state.allTalks.length,
          (talks: Talk[]) => {
            this.setState({
              allTalks: this.state.allTalks.concat(talks)
            })
          })
      }
    }
  };


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

  getTalksByTopicOnly = (talks: Talk[], topicsId: number[]): Talk[] => {
    let res: Talk[] = [];
    let talkCount: number = 0;
    for (let talk of talks) {
      let isIn: boolean = false;
      
      for (let topic of talk.topics) {
        
        if (!isIn && (topicsId.includes(topic.id) 
        || topicsId.includes(topic.parent_1_id!)
        || topicsId.includes(topic.parent_2_id!)
        || topicsId.includes(topic.parent_3_id!))) {
          isIn = true;
          res.push(talk);
          ++talkCount;
        }
      }
    }
    // console.log(res.length , talkCount)
    return res;
  };
  
  getTalksByTopicsAndAudience = (talks: Talk[], topicsId: number[], audienceLevel: string[]): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      for (let topic of talk.topics) {
        if (!isIn && (topicsId.includes(topic.id)|| topicsId.includes(topic.parent_1_id!)
        || topicsId.includes(topic.parent_2_id!)
        || topicsId.includes(topic.parent_3_id!)) && audienceLevel.includes(talk.audience_level)) {
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
        background="#color5"
      >
        <Text size="12px" weight="bold" color="grey">
          Currently no public talks in that category
        </Text>
      </Box>
    );
  };

  render() {
    return (
      <Box 
        width="100%" 
        margin={{
          "bottom": "50px",
          // "left": (window.innerWidth < 800 ? "30px" : "0px"),
        }}
      >
        <Box
          width="100%"
          direction="row"
          gap="medium"
          align="end"
          margin={{ 
            bottom: "15px", 
            top: (window.innerWidth < 800 ? "30px" : "50px"), 
            
          }}
        >
          {this.props.title && (
            <>
            <Box width="70%" alignContent="start" direction="row">
              <Link
              to={{ pathname: "/browse" }}
              style={{ textDecoration: "none" }}
              >
              <Box
                onClick={()=>{}}
                background="color2"
                round="xsmall"
                pad="xsmall"
                height="30px"
                width={this.state.renderMobile ? "150px" : "170px"}
                justify="center"
                alignContent="center"
                focusIndicator={false}
                hoverIndicator="color2"
                margin={{ left: "0px" }}
                direction="row"
              >
                {this.state.renderMobile 
                  ? <Text size="14px" weight="bold"> Upcoming</Text> 
                  : <Text size="14px" weight="bold"> Upcoming seminars</Text>
                }
                {/* <Text size="22px">🔥</Text> */}
              </Box>
              </Link>

              <Link
              to={{ pathname: "/past" }}
              style={{ textDecoration: "none" }}
              >
              <Box
                onClick={()=>{}}
                background="color5"
                round="xsmall"
                pad="xsmall"
                height="30px"
                width={this.state.renderMobile ? "150px" : "170px"}
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="color2"
                margin={{ left: "0px" }}
                direction="row"
              >
                {this.state.renderMobile 
                  ? <Text size="14px" weight="bold"> Past</Text> 
                  : <Text size="14px" weight="bold"> Past seminars</Text>
                }
                {/* <Text size="22px">🔥</Text> */}
              </Box>
              </Link>
            </Box>

            <Box width="30%" justify="end" align="end">
            {!this.state.renderMobile && (
              <Link
              to={{ pathname: "/agoras" }}
              style={{ textDecoration: "none" }}
              >
              <Box
                onClick={()=>{}}
                background="color7"
                round="xsmall"
                pad="xsmall"
                height="30px"
                width={this.state.renderMobile ? "150px" : "150px"}
                justify="center"
                align="center"
                focusIndicator={false}
                hoverIndicator="color6"
                margin={{ left: "0px" }}
                direction="row"
              >
                <Text size="14px" weight="bold"> Give a talk</Text>
              </Box>
              </Link>
              )
            }
            </Box>
            </>
          )}

        </Box>

        {/* A. Classification system for desktop */}
        <MediaQuery minDeviceWidth={992}>
          <Box 
            width="100%" 
            margin={{"bottom": "50px"}}
            background="color6"
            direction="row"
            pad="12px"
            round="xsmall"
          >
            <Box direction="column" width="25%">
              <Text size="12px" weight="bold" margin={{bottom: "10px"}}> 
                Topic
              </Text>
              {this.getPrimitiveNodes().filter((topic: Topic) =>{
                return this.state.audienceLevel.length != 0 ? 
                this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length > 0:
                this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length > 0 })
                .map((topic: Topic)=>
                
                <Box
                  onClick={() => {
                    this.updateTopic(topic)
                    // console.log(this.getTalksByTopicOnly(this.state.allTalks, [topic.id]))
                    // console.log(this.state.audienceLevel.length)
                  }}
                  background={this.state.chosenTopic === topic? "#0C385B" : "white"}
                  round="xsmall"
                  pad="5px"
                  width="80%"
                  justify="center"
                  align="start"
                  focusIndicator={false}
                  margin="3px"
                  hoverIndicator="#DDDDDD"
                >
                  <Text size="12px" margin={{left: "5px"}}>
                    {topic.field}
                    {/* {`${topic.field} (${
                      this.state.audienceLevel.length != 0 ? 
                      String(this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length) :
                      String(this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length)
                      })`} */}
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
                this.getChildren(this.state.chosenTopic).slice(0, 7).filter((topic: Topic) =>{return this.state.audienceLevel.length != 0 ? 
                  this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length > 0:
                  this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length > 0 }).map((topic: Topic) =>
                  <Box
                    onClick={() => {this.updateSubtopics(topic)}}
                    background={this.state.chosenSubtopics.includes(topic) ? "#0C385B" : "white"} 
                    round="xsmall"
                    pad="5px"
                    width="90%"
                    justify="center"
                    align="start"
                    focusIndicator={false}
                    margin="3px"
                    hoverIndicator="#DDDDDD"
                  >
                    <Text size="12px" margin={{left: "5px"}}>
                    {topic.field}
                    {/* {`${topic.field} (${
                      this.state.audienceLevel.length != 0 ? 
                      String(this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length) :
                      String(this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length)
                      })`} */}
                    </Text>
                  </Box>
                )
              )}

            </Box> 

            <Box direction="column" width="25%" margin={{top: "24px", right: "60px"}}>
              {this.state.chosenTopic.field !== "-" && (
                this.getChildren(this.state.chosenTopic).slice(7).filter((topic: Topic) =>{return this.state.audienceLevel.length != 0 ? 
                  this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length > 0:
                  this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length > 0 }).map((topic: Topic) =>
                  <Box
                    onClick={() => {this.updateSubtopics(topic)}}
                    background={this.state.chosenSubtopics.includes(topic) ? "#0C385B" : "white"} 
                    round="xsmall"
                    pad="5px"
                    width="90%"
                    justify="center"
                    align="start"
                    focusIndicator={false}
                    margin="3px"
                    hoverIndicator="#DDDDDD"
                  >
                    <Text size="12px">
                    {`${topic.field} (${
                      this.state.audienceLevel.length != 0 ? 
                      String(this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length) :
                      String(this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length)
                      })`}
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
                  align="start"
                  focusIndicator={false}
                  margin="3px"
                  hoverIndicator="#DDDDDD"
                >
                  <Text size="12px" margin={{left: "5px"}}>
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