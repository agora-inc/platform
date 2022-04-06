import React, { Component, useEffect, useState } from "react";
import { Box, Heading, Text, DropButton } from "grommet";
import Loading from "../Components/Core/Loading";
import SmallSelector from "../Components/Core/SmallSelector";
import { PastTalkCard } from "../Components/Talks/PastTalkCard";
import { Talk, TalkService } from "../Services/TalkService";
import { Topic, TopicService } from "../Services/TopicService";
import TopicClassification from "../Components/Homepage/TopicClassification";
import MediaQuery from "react-responsive";
import "../Styles/landing-page.css";
import "../Styles/home.css";
import { Link } from "react-router-dom";
import TrendingTalksList from "../Components/Homepage/TrendingTalksList";
import { useStore } from "../store";
import { useAuth0 } from "@auth0/auth0-react";
import FooterComponent from "../Components/Homepage/FooterComponent";

const breakpoint_width = 992;

const emptyTopic = {
  field: "-",
  id: -1,
  is_primitive_node: false,
  parent_1_id: -1,
  parent_2_id: -1,
  parent_3_id: -1,
};

const allAudienceLevels = ["General audience", "Bachelor/Master", "PhD+"];

interface State {
  totalNumberOfTalks: number;
  loading: boolean;
  //   sortBy: string;
  allTalks: Talk[];
  allTopics: Topic[];
  chosenTopic: Topic;
  chosenSubtopics: Topic[];
  audienceLevel: string[];
  allAudienceLevels: string[];
  renderMobile: boolean;
  hadFirstTalkFetch: boolean;
  isFetchingNewTalks: boolean;
  displayedTalks: Talk[];
}

export const AllPastTalksPage = () => {
  const [totalNumberOfTalks, setTotalNumberOfTalks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allTalks, setAllTalks] = useState<Talk[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [chosenTopic, setChosenTopic] = useState<Topic>(emptyTopic);
  const [chosenSubtopics, setChosenSubtopics] = useState<Topic[]>([]);
  const [audienceLevel, setAudienceLevel] = useState<string[]>([]);
  const [renderMobile, setRenderMobile] = useState(window.innerWidth < 800);
  const [hadFirstTalkFetch, setHadFirstTalkFetch] = useState(false);
  const [isFetchingNewTalks, setIsFetchingNewTalks] = useState(false);
  const [displayedTalks, setDisplayedTalks] = useState<Talk[]>([]);

  const user = useStore((state) => state.loggedInUser);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll, true);
    fetchData();
    return () => {
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  useEffect(() => {
    fetchFilteredTalks();
  }, [chosenSubtopics]);

  const fetchData = () => {
    TopicService.getAll((allTopics: Topic[]) => {
      setAllTopics(allTopics);
      TalkService.getAvailablePastTalks(
        10,
        0,
        user?.id || null,
        (allTalks: Talk[]) => {
          if (allTalks) {
            setAllTalks(allTalks);
            setHadFirstTalkFetch(true);
            setDisplayedTalks(allTalks);
          }
        }
      );
    });
  };

  const handleScroll = (e: any) => {
    var totalHeight = e.target.scrollHeight;
    var scrolledFromTop = e.target.scrollTop;
    var screenClientHeight = e.target.clientHeight;

    var scrollingRemaining = totalHeight - scrolledFromTop;

    // Trigger when 1.2 times the size of screenClient is remaining
    var almostReachedBottom = scrollingRemaining / screenClientHeight < 1.5;

    if (almostReachedBottom == true && hadFirstTalkFetch == true) {
      var n_talks = 0;
      // check if fetch talks by topics, subtopics, or general
      var fetchTalkByTopic =
        chosenSubtopics.length == 0 && chosenTopic.id !== -1;
      var fetchTalkBySubtopic = chosenSubtopics.length !== 0;

      // check if it's currently fetching
      if (!isFetchingNewTalks) {
        setIsFetchingNewTalks(true);
        // All fetches are maxed to 40
        if (fetchTalkByTopic) {
          // if(props.past){
          TalkService.getAllPastTalksForTopicWithChildren(
            40,
            displayedTalks.length,
            chosenTopic.id,
            (talks: Talk[]) => {
              if (talks.length > 0) {
                setAllTalks(allTalks.concat(talks));
                setDisplayedTalks(displayedTalks.concat(talks));
                setIsFetchingNewTalks(false);
              }
            }
          );
          // } else {
          // TalkService.getAllFutureTalksForTopicWithChildren(
          //   40,
          //   displayedTalks.length,
          //   chosenTopic.id,
          //   (talks: Talk[]) => {
          //     setState({
          //       allTalks: allTalks.concat(talks),
          //       displayedTalks: displayedTalks.concat(talks)
          //       }, () => {
          //         setState({isFetchingNewTalks: false})
          //       })
          //     }
          //   )
        } else if (fetchTalkBySubtopic) {
          // NB: we only have methods to fetch for 1 subtopic at a time.
          // if(props.past){
          for (let topic of chosenSubtopics) {
            TalkService.getAllPastTalksForTopicWithChildren(
              40,
              displayedTalks.length,
              topic.id,
              (talks: Talk[]) => {
                if (talks.length > 0) {
                  setAllTalks(allTalks.concat(talks));
                  setDisplayedTalks(displayedTalks.concat(talks));
                  setIsFetchingNewTalks(false);
                }
              }
            );
            //   };
            // } else {
            // for(let topic of chosenSubtopics){
            //   TalkService.getAllFutureTalksForTopicWithChildren(
            //     40,
            //     displayedTalks.length,
            //     topic.id,
            //     (talks: Talk[]) => {
            //     setState({
            //       allTalks: allTalks.concat(talks),
            //       displayedTalks: displayedTalks.concat(talks)
            //     }, () => {
            //       setState({isFetchingNewTalks: false})
            //     })
            //   })
          }
        } else {
          // if(props.past){
          TalkService.getAvailablePastTalks(
            40,
            displayedTalks.length,
            user ? user.id : null,
            (talks: Talk[]) => {
              if (talks && talks.length > 0) {
                setAllTalks(allTalks.concat(talks));
                setDisplayedTalks(displayedTalks.concat(talks));
                setIsFetchingNewTalks(false);
              }
            }
          );
          // } else {
          // TalkService.getAvailableFutureTalks(
          //   40,
          //   displayedTalks.length,
          //   props.user ? props.user.id : null,
          //   (talks: Talk[]) => {
          //     setState({
          //       allTalks: allTalks.concat(talks),
          //       displayedTalks: displayedTalks.concat(talks)
          //     }, () => {
          //       setState({isFetchingNewTalks: false})
          //     })
          //   })
        }
      }
    }
  };

  const getTalksByTopicOnly = (talks: Talk[], topicsId: number[]): Talk[] => {
    let res: Talk[] = [];
    let talkCount: number = 0;
    for (let talk of talks) {
      let isIn: boolean = false;
      if (talk !== undefined) {
        if (!(talk.topics === undefined)) {
          for (let topic of talk.topics) {
            if (
              !isIn &&
              (topicsId.includes(topic.id) ||
                topicsId.includes(topic.parent_1_id!) ||
                topicsId.includes(topic.parent_2_id!) ||
                topicsId.includes(topic.parent_3_id!))
            ) {
              isIn = true;
              res.push(talk);
              ++talkCount;
            }
          }
        }
      }
    }
    // console.log(res.length , talkCount)
    return res;
  };

  const getTalksByTopicsAndAudience = (
    talks: Talk[],
    topicsId: number[],
    audienceLevel: string[]
  ): Talk[] => {
    let res: Talk[] = [];
    for (let talk of talks) {
      let isIn: boolean = false;
      for (let topic of talk.topics) {
        if (
          !isIn &&
          (topicsId.includes(topic.id) ||
            topicsId.includes(topic.parent_1_id!) ||
            topicsId.includes(topic.parent_2_id!) ||
            topicsId.includes(topic.parent_3_id!)) &&
          audienceLevel.includes(talk.audience_level)
        ) {
          isIn = true;
          res.push(talk);
        }
      }
    }
    return res;
  };

  const getTalksByAudience = (
    talks: Talk[],
    audienceLevel: string[]
  ): Talk[] => {
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

  const getChildren = (topic: Topic) => {
    return allTopics.filter(function (temp: Topic) {
      return (
        temp.parent_1_id == topic.id ||
        temp.parent_2_id == topic.id ||
        temp.parent_3_id == topic.id
      );
    });
  };

  const getPrimitiveNodes = () => {
    return allTopics.filter(function (topic: any) {
      return topic.is_primitive_node;
    });
  };

  const fetchFilteredTalks = () => {
    let topicsId = getIdTopicsToFetch();
    let level = audienceLevel.length > 0 ? audienceLevel : allAudienceLevels;
    if (topicsId.length > 0) {
      return getTalksByTopicsAndAudience(allTalks, topicsId, level);
    } else {
      return getTalksByAudience(allTalks, level);
    }
  };

  const updateAudienceLevel = (txt: string) => {
    if (audienceLevel.includes(txt)) {
      setAudienceLevel(audienceLevel.filter((e) => e != txt));
      setDisplayedTalks(fetchFilteredTalks());
    } else {
      setAudienceLevel(audienceLevel.concat(txt));
      setDisplayedTalks(fetchFilteredTalks());
    }
  };

  const updateTopic = (topic: Topic) => {
    if (chosenTopic === topic) {
      setChosenTopic(emptyTopic);
    } else {
      setChosenTopic(topic);
    }
    setChosenSubtopics([]);
  };

  const updateSubtopics = (topic: Topic) => {
    if (chosenSubtopics.length === 0) {
      setChosenSubtopics([topic]);
    } else if (chosenSubtopics.includes(topic)) {
      let subtopics = chosenSubtopics.filter((e) => e.id !== topic.id);
      setChosenSubtopics(subtopics);
    } else {
      let subtopics = chosenSubtopics.concat(topic);
      setChosenSubtopics(subtopics);
    }
  };

  const getIdTopicsToFetch = () => {
    if (chosenTopic.field === "-") {
      return [];
    } else if (chosenSubtopics.length === 0) {
      return getChildren(chosenTopic)
        .map((topic) => topic.id)
        .concat(chosenTopic.id);
    } else {
      return chosenSubtopics.map((topic) => topic.id);
    }
  };

  const selectTopicMobile = (temp: Topic) => {
    setChosenTopic(temp);
  };

  return (
    <Box justify="center">
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
      <Box
        pad={{ top: "9vh" }}
        // align="start"
        style={{ overflowY: "auto" }}
        onScroll={handleScroll}
        height="100%"
        width="80%"
        margin={{ left: "10%", right: "10%" }}
      >
        {/* <video
        autoPlay loop muted id="background-landing"
        style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
      >
        <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4"/>
      </video> */}
        <Box align="start" margin={{ bottom: "20px" }}>
          <TrendingTalksList />
        </Box>
        <Box width="100%">
          <Box
            direction="row"
            width="100%"
            justify="between"
            align="start"
            margin={{ bottom: "15px", top: "50px" }}
          >
            <Box width="70%" alignContent="start" direction="row">
              <Link
                to={{ pathname: "/browse" }}
                style={{ textDecoration: "none" }}
              >
                <Box
                  onClick={() => {}}
                  background="color5"
                  round="xsmall"
                  pad="xsmall"
                  height="30px"
                  width={renderMobile ? "150px" : "170px"}
                  justify="center"
                  focusIndicator={false}
                  hoverIndicator="color2"
                  margin={{ left: "0px" }}
                  direction="row"
                >
                  {renderMobile ? (
                    <Text size="14px" weight="bold">
                      {" "}
                      Upcoming
                    </Text>
                  ) : (
                    <Text size="14px" weight="bold">
                      {" "}
                      Upcoming seminars
                    </Text>
                  )}
                  {/* <Text size="22px">🔥</Text> */}
                </Box>
              </Link>

              <Link
                to={{ pathname: "/past" }}
                style={{ textDecoration: "none" }}
              >
                <Box
                  onClick={() => {}}
                  background="color2"
                  round="xsmall"
                  pad="xsmall"
                  height="30px"
                  width={renderMobile ? "150px" : "170px"}
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator="color2"
                  margin={{ left: "0px" }}
                  direction="row"
                >
                  {renderMobile ? (
                    <Text size="14px" weight="bold">
                      {" "}
                      Past
                    </Text>
                  ) : (
                    <Text size="14px" weight="bold">
                      {" "}
                      Past seminars
                    </Text>
                  )}
                  {/* <Text size="22px">🔥</Text> */}
                </Box>
              </Link>
            </Box>

            <Box width="30%" justify="end" align="end">
              {!renderMobile && (
                <Link
                  to={{ pathname: "/agoras" }}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    onClick={() => {}}
                    background="color7"
                    round="xsmall"
                    pad="xsmall"
                    height="30px"
                    width={renderMobile ? "150px" : "150px"}
                    justify="center"
                    align="center"
                    focusIndicator={false}
                    hoverIndicator="color6"
                    margin={{ left: "0px" }}
                    direction="row"
                  >
                    <Text size="14px" weight="bold">
                      {" "}
                      Give a talk
                    </Text>
                  </Box>
                </Link>
              )}
            </Box>
          </Box>

          <MediaQuery minDeviceWidth={992}>
            <Box
              width="100%"
              margin={{ bottom: "30px" }}
              background="color6"
              direction="row"
              pad="12px"
              round="xsmall"
            >
              <Box direction="column" width="25%">
                <Text size="12px" weight="bold" margin={{ bottom: "10px" }}>
                  Topic
                </Text>
                {getPrimitiveNodes()
                  .filter((topic: Topic) => {
                    return audienceLevel.length != 0
                      ? getTalksByTopicsAndAudience(
                          allTalks,
                          [topic.id],
                          audienceLevel
                        ).length > 0
                      : getTalksByTopicOnly(allTalks, [topic.id]).length > 0;
                  })
                  .map((topic: Topic) => (
                    <Box
                      onClick={() => {
                        updateTopic(topic);
                        // console.log(audienceLevel.length)
                      }}
                      background={chosenTopic === topic ? "#0C385B" : "white"}
                      round="xsmall"
                      pad="5px"
                      width="80%"
                      justify="center"
                      align="start"
                      focusIndicator={false}
                      margin="3px"
                      hoverIndicator="#DDDDDD"
                    >
                      <Text size="12px" margin={{ left: "5px" }}>
                        {topic.field}
                        {/* {`${topic.field} (${
                    audienceLevel.length != 0 ? 
                    String(getTalksByTopicsAndAudience(allTalks, [topic.id] , audienceLevel).length) :
                    String(getTalksByTopicOnly(allTalks, [topic.id]).length)
                    })`} */}
                      </Text>
                    </Box>
                  ))}
              </Box>

              <Box direction="column" width="25%">
                <Text size="12px" weight="bold" margin={{ bottom: "10px" }}>
                  Sub-topics
                </Text>
                {chosenTopic.field === "-" && (
                  <Text size="12px" style={{ fontStyle: "italic" }}>
                    Select a topic to display its subtopics
                  </Text>
                )}
                {chosenTopic.field !== "-" &&
                  getChildren(chosenTopic)
                    .slice(0, 7)
                    .filter((topic: Topic) => {
                      return audienceLevel.length != 0
                        ? getTalksByTopicsAndAudience(
                            allTalks,
                            [topic.id],
                            audienceLevel
                          ).length > 0
                        : getTalksByTopicOnly(allTalks, [topic.id]).length > 0;
                    })
                    .map((topic: Topic) => (
                      <Box
                        onClick={() => {
                          updateSubtopics(topic);
                        }}
                        background={
                          chosenSubtopics.includes(topic) ? "#0C385B" : "white"
                        }
                        round="xsmall"
                        pad="5px"
                        width="90%"
                        justify="center"
                        align="start"
                        focusIndicator={false}
                        margin="3px"
                        hoverIndicator="#DDDDDD"
                      >
                        <Text size="12px" margin={{ left: "5px" }}>
                          {topic.field}
                          {/* {`${topic.field} 
                  (${
                    audienceLevel.length != 0 ? 
                    String(getTalksByTopicsAndAudience(allTalks, [topic.id] , audienceLevel).length) :
                    String(getTalksByTopicOnly(allTalks, [topic.id]).length)
                    })`
                    } */}
                        </Text>
                      </Box>
                    ))}
              </Box>

              <Box
                direction="column"
                width="25%"
                margin={{ top: "24px", right: "60px" }}
              >
                {chosenTopic.field !== "-" &&
                  getChildren(chosenTopic)
                    .slice(7)
                    .filter((topic: Topic) => {
                      return audienceLevel.length != 0
                        ? getTalksByTopicsAndAudience(
                            allTalks,
                            [topic.id],
                            audienceLevel
                          ).length > 0
                        : getTalksByTopicOnly(allTalks, [topic.id]).length > 0;
                    })
                    .map((topic: Topic) => (
                      <Box
                        onClick={() => {
                          updateSubtopics(topic);
                        }}
                        background={
                          chosenSubtopics.includes(topic) ? "#0C385B" : "white"
                        }
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
                          {topic.field}
                          {/* {`${topic.field} (${
                    audienceLevel.length != 0 ? 
                    String(getTalksByTopicsAndAudience(allTalks, [topic.id] , audienceLevel).length) :
                    String(getTalksByTopicOnly(allTalks, [topic.id]).length)
                    })`} */}
                        </Text>
                      </Box>
                    ))}
              </Box>

              <div id="vertical-line"> {} </div>

              <Box direction="column" width="20%">
                <Text size="12px" weight="bold" margin={{ bottom: "10px" }}>
                  Audience level
                </Text>
                {allAudienceLevels.map((txt: string) => (
                  <Box
                    onClick={() => {
                      updateAudienceLevel(txt);
                    }}
                    background={
                      audienceLevel.includes(txt) ? "#0C385B" : "white"
                    }
                    round="xsmall"
                    pad="5px"
                    width="90%"
                    justify="center"
                    align="start"
                    focusIndicator={false}
                    margin="3px"
                    hoverIndicator="#DDDDDD"
                  >
                    <Text size="12px" margin={{ left: "5px" }}>
                      {txt}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </MediaQuery>

          {/* B. Classification system for mobile */}
          <MediaQuery maxDeviceWidth={992}>
            <TopicClassification
              topicCallback={selectTopicMobile}
              searchType="Talks"
            />
          </MediaQuery>

          {/* Very bad copy-pasting for mobile hack (A) */}
          <MediaQuery minDeviceWidth={992}>
            <Box direction="row" gap="1%" wrap margin={{ top: "20px" }}>
              {displayedTalks.map((talk: Talk, index: number) => (
                <PastTalkCard talk={talk} width="24%" />
              ))}
            </Box>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={992}>
            <Box direction="row" gap="1%" wrap margin={{ top: "20px" }}>
              {displayedTalks.map((talk: Talk, index: number) => (
                <PastTalkCard talk={talk} width="100%" />
              ))}
            </Box>
          </MediaQuery>
        </Box>

        {displayedTalks.length === 0 && (
          <Box
            direction="row"
            width="280px"
            margin="none"
            pad="small"
            justify="center"
            round="xsmall"
            alignSelf="center"
            background="#EEEEEE"
          >
            <Text size="12px" weight="bold" color="grey">
              Currently no public talks in that category
            </Text>
          </Box>
        )}

        {/* {videos.length !== totalNumberOfVideos && (
        <Box
          onClick={fetchVideos}
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
        <FooterComponent />
      </Box>
    </Box>
  );
};
