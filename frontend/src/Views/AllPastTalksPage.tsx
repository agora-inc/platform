import React, { Component } from "react";
import { Box, Heading, Text, DropButton } from "grommet";
import Loading from "../Components/Core/Loading";
import SmallSelector from "../Components/Core/SmallSelector";
import PastTalkCard from "../Components/Talks/PastTalkCard";
import { Talk, TalkService } from "../Services/TalkService";
import { User, UserService } from "../Services/UserService";
import { Topic, TopicService } from "../Services/TopicService";
import MediaQuery from "react-responsive";

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
      chosenTopic: {
        field: "-",
        id: -1,
        is_primitive_node: false,
        parent_1_id: -1,
        parent_2_id: -1,
        parent_3_id: -1,
      },
      chosenSubtopics: [],
      audienceLevel: [],
      allAudienceLevels: ["General audience", "Bachelor/Master", "PhD+"],
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
    TalkService.getAllPastTalks(
      100,
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

  //   sortVideos = () => {
  //     return this.state.sortBy === "date"
  //       ? this.state.videos.sort(this.compareVideosByDate)
  //       : this.state.videos.sort(this.compareVideosByViews);
  //   };

  render() {
    return (
      <Box
        pad={{ top: "10vh", bottom: "100px" }}
        align="center"
        style={{ overflowY: "scroll" }}
        onScroll={this.handleScroll}
      >
        <Box width="90%" margin={{ left: "2.5%" }}>
          <Box
            direction="row"
            width="100%"
            justify="between"
            align="end"
            margin={{ bottom: "medium" }}
          >
            <Heading
              color="black"
              size="24px"
              margin="none"
              style={{ height: "20px" }}
            >
              All previous talks
            </Heading>
            {/* <Box direction="row" align="center" gap="xsmall">
              <Text color="black" weight="bold">
                Filter by
              </Text>
              <SmallSearchBar placeholder="search tags" />
            </Box> */}
            {/* <Box
              direction="row"
              align="center"
              gap="xsmall"
              margin={{ right: "2.5%" }}
            >
              <Text color="black" weight="bold">
                Sort by
              </Text>
              <SmallSelector
                callback={(sortBy: string) =>
                  this.setState({ sortBy: sortBy.toLowerCase() })
                }
              />
            </Box> */}
          </Box>

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


          <Box
            direction="row"
            gap="1%"
            wrap
            // justify="center"
            margin={{ top: "20px" }}
          >
            {this.fetchFilteredTalks().map((talk: Talk, index: number) => (
              <PastTalkCard talk={talk} width="24%" user={this.state.user} />
            ))}
          </Box>
        </Box>
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
    );
  }
}
