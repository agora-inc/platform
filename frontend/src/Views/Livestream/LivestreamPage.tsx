import React, { Component } from "react";
import LivestreamAdminPage from "./LivestreamAdminPage";
import LivestreamAudiencePage from "./LivestreamAudiencePage";
import LivestreamSpeakerPage from "./LivestreamSpeakerPage";
import LivestreamErrorPage from "./LivestreamErrorPage";
import { UrlEncryption } from "../../Components/Core/Encryption/UrlEncryption";
import { TalkService, Talk } from "../../Services/TalkService";
import { UserService, User } from "../../Services/UserService";
import { ChannelService } from "../../Services/ChannelService";
import { Box, Text, Image } from "grommet";


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
  talkNotFound: boolean;
  talkErrorMsg: string
}


export default class LivestreamPage extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      
      this.state = {
          talkId: -1,
          talkRole: "admin",
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
            channelRole: "",
            talkNotFound: false,
            talkErrorMsg: ""
        };
        //   console.log("talkId extracted")
        //   console.log(UrlEncryption.getIdFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", "")))
        //   console.log("extracted stream role")
        //   console.log(UrlEncryption.getRoleFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", "")))
    }
    
    componentDidMount() {
        this.fetchAll()
        if (this.state.channelRole == "owner"){
            this.setState({talkRole: "admin"})
        }
    }

    readUrl(callback: any){
        try{
            this.setState({
                talkId: Number(UrlEncryption.getIdFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", ""))),
                talkRole: UrlEncryption.getRoleFromEncryptedEndpoint(this.props.location.pathname.replace("/livestream/", "")),
            }, () => {
                    console.log("ID = ");
                    console.log(this.state.talkId);
                    if (!(this.state.talkId == 0)){
                        callback()
                        }
                    else {
                        this.setState({
                            talkNotFound: true,
                            talkErrorMsg: "Badly formatted URL. Could not extract ID."
                            }
                        )
                    }
                }   
            )
        }
        catch(e){
            console.log(e);
            this.setState({
                talkNotFound: true,
                talkErrorMsg: "Badly formatted URL. Could not extract ID."
                }
            )
        }
    }

    fetchAll() {
        // decode URL
        this.readUrl(() => {
            // fetch talk info
            TalkService.getTalkById(this.state.talkId, (talk: Talk) => {
                console.log("test")
                console.log(talk)
                if (!(talk == null)){
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
                } else {
                    this.setState({
                        talkNotFound: true,
                        talkErrorMsg: "This event has been modified or no longer exists. Contact an organiser for a new URL."
                    })
                }
            
            });
            }
        )
    }
    
    
    render() {
        if (!(this.state.talkNotFound)){
            return (
                <LivestreamAdminPage
                    talkId={this.state.talkId}
                    // role={this.state.talkRole}
                    role="audience"
                />
            )
        }
        else {
            return (
                <LivestreamErrorPage
                    errorMessage={this.state.talkErrorMsg}
                />
            )
        }
    }
}