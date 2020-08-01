import React, { Component } from "react";
import { Box } from "grommet";
import ChannelPageTalkCard from "./ChannelPageTalkCard";
import { User } from "../../Services/UserService";
import { Talk, TalkService } from "../../Services/TalkService";
import Loading from "../Core/Loading";

interface Props {
  talks: Talk[];
  channelId: number;
  user: User | null;
  admin: boolean;
  onEditCallback?: any;
  showTalkId?: number;
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
      <Box gap="1.5%" direction="row" width="100%" wrap>
        {this.props.talks.map((talk: Talk) => (
          <ChannelPageTalkCard
            width="31.5%"
            talk={talk}
            user={this.props.user}
            admin={this.props.admin}
            onEditCallback={this.props.onEditCallback}
            margin={{ bottom: "medium" }}
            show={this.props.showTalkId === talk.id}
          />
        ))}
      </Box>
    );
  }
}
