import React, { Component } from "react";
import { Box, Select, Text } from "grommet";
import { User } from "../../Services/UserService";
import { Topic, TopicService } from "../../Services/TopicService";
import { Talk, TalkService } from "../../Services/TalkService";
// import allTopics from "../../assets/allTopics.json"
import "../../Styles/topic-classification.css";
import StandardClassificationBar from "./standardClassificationBar";


interface Props {
  gridArea?: string;
  past?: boolean;
  onSave?: any;
  onUnsave?: any;
  seeMore: boolean;
  title: boolean;
  topicSearch: boolean;
  user: User | null;
  talkPast: boolean;
  topicCallback: any
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




  render() {
    return (
      <Box width="100%" direction="column">
        <Box
          width="100%"
          direction="row"
          gap="xsmall"
          align="end"
          margin={{ bottom: "15px" }}
        >
          <Text size="14px" color="grey" margin="5px" weight="bold">
            Filter Upcoming Talks
          </Text>
        </Box>

        <Box 
          direction="row" 
          className="classification_box"
        >
          <Select
            options={ ["General Audience", "Bachelor / Master", "PhD+", "All"] }
            placeholder={"Education Level"}
            dropHeight="medium"
          />
          
          <StandardClassificationBar
            topicCallback={this.props.topicCallback}
          />

          {this.props.talkPast && (
            <Select
              options={ ["Public", "Private", "All"] }
              placeholder={"Visibility"}
              dropHeight="medium"
            />
          )}
        </Box>
      </Box>
    );
  };
}