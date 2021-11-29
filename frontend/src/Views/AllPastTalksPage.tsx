import React, { Component } from "react";
import { Box, Heading, Text, DropButton } from "grommet";
import Loading from "../Components/Core/Loading";
import SmallSelector from "../Components/Core/SmallSelector";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import { Talk, TalkService } from "../Services/TalkService";
import { User, UserService } from "../Services/UserService";
import { Topic, TopicService } from "../Services/TopicService";
import TopicClassification from "../Components/Homepage/TopicClassification";
import MediaQuery from "react-responsive";
import "../Styles/landing-page.css";
import "../Styles/home.css";
import { Link } from "react-router-dom";
import TrendingTalksList from "../Components/Homepage/TrendingTalksList";

interface State {
  totalNumberOfTalks: number;
  loading: boolean;
  user: User | null;
  //   sortBy: string;
  allTalks: Talk[];
  allTopics: Topic[];
  chosenTopic: Topic;
  chosenSubtopics: Topic[];
  audienceLevel: string[];
  allAudienceLevels: string[];
  renderMobile: boolean
  
}

var emptyTopic = {
  field: "-",
  id: -1,
  is_primitive_node: false,
  parent_1_id: -1,
  parent_2_id: -1,
  parent_3_id: -1,
}

export default class AllPastTalksPage extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      totalNumberOfTalks: 0,
      loading: true,
      user: UserService.getCurrentUser(),
      //   sortBy: "date",
      allTalks: [],
      allTopics: [],
      chosenTopic: emptyTopic,
      chosenSubtopics: [],
      audienceLevel: [],
      allAudienceLevels: ["General audience", "Bachelor/Master", "PhD+"],
      renderMobile: window.innerWidth < 800
    };
  }

  componentWillMount() {
    TopicService.getAll((allTopics: Topic[]) => {
      this.setState({ allTopics });
    });
    window.addEventListener("scroll", this.handleScroll, true);
    this.fetchTalks();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && this.state.allTalks.length !== this.state.totalNumberOfTalks) {
      this.fetchTalks();
    }
  };

  fetchTalks = () => {
    console.log(this.state.user!.id);
    TalkService.getAllPastTalks(
      20,
      this.state.allTalks.length,
      (data: { count: number; talks: Talk[] }) => {
        this.setState({
          allTalks: this.state.allTalks.concat(data.talks),
          totalNumberOfTalks: data.count,
          loading: false,
        });
      }
    );
  };

  compareTalksByDate = (a: Talk, b: Talk) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    if (aDate < bDate) {
      return 1;
    }
    if (aDate > bDate) {
      return -1;
    }
    return 0;
  };

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

  //   sortVideos = () => {
  //     return this.state.sortBy === "date"
  //       ? this.state.videos.sort(this.compareVideosByDate)
  //       : this.state.videos.sort(this.compareVideosByViews);
  //   };

  render() {
    var breakpoint_width = 992
    return (
      <>
      <img style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }} id="background-landing"
      src="https://i.postimg.cc/RhmJmzM3/mora-social-media-cover-bad6db.jpg"
      />
      <Box
        pad={{ top: "10vh", bottom: "100px" }}
        align="start"
        style={{ overflowY: "auto" }}
        onScroll={this.handleScroll}
        margin={{left: "8%", right: "8%"}}
      >
        {/* <video
          autoPlay loop muted id="background-landing"
          style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4"/>
        </video> */}
        <Box align="start" margin={{bottom: "20px"}}>
          <TrendingTalksList />
        </Box>
        <Box width="90%">


          <Box
            direction="row"
            width="100%"
            justify="between"
            align="start"
            margin={{ bottom: "medium", top: "50px" }}
          >
            <Box width="70%" alignContent="start" direction="row">
              <Link
              to={{ pathname: "/browse" }}
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
                background="color2"
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
          </Box>

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
                    {`${topic.field} (${
                      this.state.audienceLevel.length != 0 ? 
                      String(this.getTalksByTopicsAndAudience(this.state.allTalks, [topic.id] , this.state.audienceLevel).length) :
                      String(this.getTalksByTopicOnly(this.state.allTalks, [topic.id]).length)
                      })`}
                
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
              
        {/* Very bad copy-pasting for mobile hack (A) */}
          <MediaQuery minDeviceWidth={992}>
            <Box
              direction="row"
              gap="1%"
              wrap
              margin={{ top: "20px" }}
            >
              {this.fetchFilteredTalks().map((talk: Talk, index: number) => (
                <PastTalkCard talk={talk} width="24%" user={this.state.user} />
              ))}
            </Box>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={992}>
            <Box
              direction="row"
              gap="1%"
              wrap
              margin={{ top: "20px" }}
            >
              {this.fetchFilteredTalks().map((talk: Talk, index: number) => (
                <PastTalkCard talk={talk} width="100%" user={this.state.user} />
              ))}
            </Box>
          </MediaQuery>

        </Box>
              
        {this.fetchFilteredTalks().length === 0 && (
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
        )}

        {/* {this.state.videos.length !== this.state.totalNumberOfVideos && (
          <Box
            onClick={this.fetchVideos}
            focusIndicator={false}
            background="white"
            pad={{ vertical: "xsmall", horizontal: "medium" }}
            round="small"
            style={{ border: "3px solid black" }}
          >
            <Text weight="bold" color="black">
              See more
            </Text>
          </Box>
        )} */}
      </Box>
      </>
    );
  }
}
