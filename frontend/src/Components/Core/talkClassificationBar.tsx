import React, { Component } from "react";
import { Box, Select, Text } from "grommet";
import { User } from "../../Services/UserService";
import { Topic, TopicService } from "../../Services/TopicService";
import { Talk, TalkService } from "../../Services/TalkService";
// import allTopics from "../../assets/allTopics.json"
import "../../Styles/topic-classification.css";
import StandardClassificationBar from "./standardClassificationBar";


interface Props {
  user: User | null;
  topicCallback: any;
  audienceCallback: any;
  visibilityCallback: any;
  talkPast: boolean;
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
  visibility: {
    public: boolean,
    private: boolean,
    all: boolean,
  }
}

export default class TalkClassificationBar extends Component<Props, State> {
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
      visibility: {
        public: true,
        private: true,
        all: true,
      }
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

  
  changestateAudience(option: string) {
    if (option == "General Audience") {
      this.setState({
        audienceLevel: {
          GeneralAudience: true,
          BachelorMaster: false,
          Phdplus: false,
          all: false
        }
      })
    }if (option == "Bachelor / Master") {
      this.setState({
        audienceLevel: {
          GeneralAudience: false,
          BachelorMaster: true,
          Phdplus: false,
          all: false
        }
      })
    }if (option == "PhD+") {
      this.setState({
        audienceLevel: {
          GeneralAudience: false,
          BachelorMaster: false,
          Phdplus: true,
          all: false
        }
      })
    }else {
      this.setState({
        audienceLevel: {
          GeneralAudience: true,
          BachelorMaster: true,
          Phdplus: true,
          all: true
        }
      })
    }
    this.props.audienceCallback(option)
  }

  changestateVisibility(option: string) {
    if (option == "Public") {
      this.setState({
        visibility: {
          public: true,
          private: false,
          all: false,
        }
      })
    }if (option == "private") {
      this.setState({
        visibility: {
          public: true,
          private: false,
          all: false,
        }
      })
    }else {
      this.setState({
        visibility: {
          public: true,
          private: true,
          all: true,
        }
      })
    }
    this.props.visibilityCallback(option)
  }



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
            onChange={({ option }) =>
              this.changestateAudience(option)
            }
          />
          
          <StandardClassificationBar
            topicCallback={this.props.topicCallback}
          />

          {this.props.talkPast && (
            <Select
              options={ ["Public", "Private", "All"] }
              placeholder={"Visibility"}
              dropHeight="medium"
              onChange={({ option }) =>
              this.changestateVisibility(option)
              }
            />
          )}
        </Box>
      </Box>
    );
  };
}