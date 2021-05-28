import React, { Component } from "react";
import LivestreamAdminPage from "./LivestreamAdminPage";
import LivestreamAudiencePage from "./LivestreamAudiencePage";
import LivestreamSpeakerPage from "./LivestreamSpeakerPage";
import { UrlEncryption } from "../Components/Core/Encryption/UrlEncryption";
import { TalkService, Talk } from "../Services/TalkService";
import { UserService, User } from "../Services/UserService";
import { ChannelService } from "../Services/ChannelService";

interface Props {
    location: { pathname: string; 
    };
    // match: {params: {encoded_endpoint: string}};
    // NOTE on why we dont use this.props.match.params.encoded_endpoint: 
    //    As the encoded endpoint contains many "/" because of AES, 
    //    calling this.props.encoded_endpoint does not grab the full endpoint.
  }

interface State {
  talk: Talk;
  talkId: number;
  talkRole: "admin" | "speaker" | "audience";
  channelRole: "owner" | "member" | any;
  user: User | null;
}


export default class LiveStreamPage extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      
      this.state = {
          talkId: UrlEncryption.getIdFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", "")),
          talkRole: UrlEncryption.getRoleFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", "")),
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
        //   console.log("talkId extracted")
        //   console.log(UrlEncryption.getIdFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", "")))
        //   console.log("extracted stream role")
        //   console.log(UrlEncryption.getRoleFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", "")))
    }
    
    componentDidMount() {
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
                            this.setState({ channelRole: channelRole }, 
                                () => {
                                    // console.log("Channel role:")
                                    // console.log(channelRole)
                                });
                            }
                        );
                    }
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