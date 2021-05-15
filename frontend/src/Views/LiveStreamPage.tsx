import React, { Component } from "react";
import LivestreamAdminPage from "./LivestreamAdminPage";
import LivestreamAudiencePage from "./LivestreamAdminPage";
import LivestreamSpeakerPage from "./LivestreamAdminPage";
import { UrlEncryption } from "../Components/Core/Encryption/UrlEncryption";
import { TalkService, Talk } from "../Services/TalkService";
import { UserService, User } from "../Services/UserService";
import { ChannelService } from "../Services/ChannelService";
import { Text } from "grommet";

interface Props {
    location: { pathname: string; 
        // state: { video: Video } 
    };
    match: {params: {encoded_endpoint: string}};
  }

interface State {
  talk: Talk;
  talkId: number;
  user: User | null;
  talkRole: "admin" | "speaker" | "audience";
  channelRole: "owner" | "member" | any
}


export default class LiveStreamPage extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        talkId: UrlEncryption.getIdFromUrl(this.props.match.params.encoded_endpoint),
        talkRole: UrlEncryption.getRoleFromUrl(this.props.match.params.encoded_endpoint),
        talk: {
            id: NaN,
            channel_id: NaN,
            channel_name: "",
            channel_colour: "",
            has_avatar: false,
            name: "",
            date: "",
            end_date: "",
            description: "",
            link: "",
            recording_link: "",
            tags: [],
            show_link_offset: NaN,
            visibility: "",
            card_visibility: "",
            topics: [],
            talk_speaker: "",
            talk_speaker_url: "",
            published: 0,
            audience_level: "All"
          },
          user: UserService.getCurrentUser(),
          channelRole: ""
      };
      this.fetchAll()
    }


    fetchAll() {
        // fetch talk info
        TalkService.getTalkById(this.state.talkId, (talk: Talk) => {
            this.setState({talk: talk}, 
                () => {
                    // fetch user info
                    if (!(this.state.user === null)){
                        ChannelService.getRoleInChannel(
                            this.state.user!.id,
                            talk.channel_id,
                            (channelRole: string) => {
                            this.setState({ channelRole: channelRole });
                            }
                        );
                    }
                    console.log("OYOYOYOY")

                    console.log(this.state.talkRole)
                    console.log(this.state.channelRole)
            
                    console.log("OYOYOYOY")
                }
            );
        });
    }

    
    render() {
        if (this.state.talkRole == "speaker"){
            console.log("speaker")
            return (
                <LivestreamSpeakerPage
                    talkId={this.state.talkId}
                />
            )
        } else if (
            (this.state.talkRole == "admin") || (this.state.channelRole == "owner")
            ){
            console.log("admin")

            return (
                <LivestreamAdminPage
                    talkId={this.state.talkId}
                />
            )
        } else {
            console.log("audience")

            return (
                <LivestreamAudiencePage
                    talkId={this.state.talkId}
                />
            )
        }
    }
}