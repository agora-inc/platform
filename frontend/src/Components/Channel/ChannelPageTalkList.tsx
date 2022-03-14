import React, { Component } from "react";
import { Box } from "grommet";
import { ChannelPageTalkCard } from "./ChannelPageTalkCard";
import { User } from "../../Services/UserService";
import { Talk, TalkService } from "../../Services/TalkService";
import Loading from "../Core/Loading";
import "../../Styles/topic-talks-list.css";

interface Props {
  talks: Talk[];
  channelId: number;
  admin: boolean;
  onEditCallback?: any;
  showTalkId?: number;
  role?: string;
  following?: boolean;
  callback?: any;
}

interface State {
  talks: Talk[];
  loading: boolean;
}

export default class ChannelPageTalkList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      talks: [],
      loading: true,
    };
  }

  componentWillMount() {
    // this.fetchTalks();
  }

  fetchTalks = () => {
    TalkService.getFutureTalksForChannel(
      this.props.channelId,
      (talks: Talk[]) => {
        this.setState({ talks, loading: false });
      }
    );
  };

  render() {
    return (
      <Box
        // className="talk_cards_outer_box"
        direction="row"
        width="100%"
        wrap
        gap="1.5%"
      >
        {this.props.talks.map((talk: Talk) => (
          <ChannelPageTalkCard
            width={window.innerWidth < 800 ? "99%" : "31.5%"}
            talk={talk}
            role={this.props.role}
            admin={this.props.admin}
            onEditCallback={this.props.onEditCallback}
            margin={{ bottom: "medium" }}
            show={this.props.showTalkId === talk.id}
            following={this.props.following ? this.props.following : false}
            callback={this.props.callback}
          />
        ))}
      </Box>
    );
  }
}
