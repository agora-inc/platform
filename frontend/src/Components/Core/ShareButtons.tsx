import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import {InlineShareButtons} from 'sharethis-reactjs';
import ReactTooltip from "react-tooltip";
import {Talk} from "../../Services/TalkService";
import {Channel} from "../../Services/ChannelService";
import { Calendar, Workshop, UserExpert, LinkNext, FormNextLink, Link as LinkIcon, Channel as ChannelIcon} from "grommet-icons";
import { threadId } from "worker_threads";
import { baseApiUrl } from "../../config";

interface Props {
    talk?: Talk | any;
    channel?: Channel | any;
  }
  
  interface State {
    title: string;
    description: string;
    emailTitle: string;
    emailMessage: string;
    imageUrl: string

  }
  
  export default class ShareButtons extends Component<Props, State> {
    constructor(props: any) {
      super(props);
      this.state = {
        title: "",
        description: "",
        emailTitle: "",
        emailMessage: "",
        imageUrl: ""
      };
    }

    // //True if talk, therefore false if Channel.
    // isTalk = (variableToCheck: any): variableToCheck is Talk => {
    //   return (variableToCheck as Talk).talk_speaker !== undefined;
    // }

    urlLink = () => {
      if (this.props.talk) {
        return `https://agora.stream/event/${this.props.talk.id}`
      } else {
        const name = this.props.talk.name.replace(/\s/g, '%20')
        return `https://agora.stream/${name}`
      }
    }

    apiUrlLink = () => {
      if(this.props.talk) {
        let url = baseApiUrl + `/event-link?
        eventId=${this.props.talk.id}`
        console.log("wesh")
        console.log(url)
        return url
      } else if (this.props.channel){
        const name = this.props.talk.name.replace(/\s/g, '%20')
        return baseApiUrl + `/Channel/
                channelId=${this.props.channel.id}`
      }
    }

    emailTitle = () => {
      if (this.props.talk) {
        return `Talk that might be of interest to you`
      } else if (this.props.channel) {
        return `An Agora that might be of interest to you`
      }
    }

    emailMessage = () => {
      if (this.props.talk) {
        return `Hey, check this out: ${this.urlLink()}`
      } else if (this.props.channel) {
        return `Hey, check this out: ${this.urlLink()}`
      }
    }

    Description = () => {
      // TODO: ADD DATE, ADD URL, RENDER LATEX
      if (this.props.talk) {
        return this.props.talk.description
      } else if (this.props.channel) {
        return this.props.channel.description
      }
    }

    Title = () => {
      return this.props.talk.name
    }

    agoraLogoUrl = () => {
      if (this.props.talk) {
        return `https://agora.stream/api/Channels/avatar?ChannelId=${this.props.talk.ChannelIcon_id}&ts=2`
      } else if (this.props.channel) {
        return `https://agora.stream/api/Channels/avatar?ChannelId=${this.props.talk.id}&ts=2`
      }
    }

    twitterUsername = () => {
      if (this.props.talk) {
        return this.props.talk.channel_name;
      } else if (this.props.channel) {
        return "agora.stream";
      }
    }

    render () {
      return (
        <Box 
          direction="row"
          style = {{ zIndex: 0 }}
        >
          <InlineShareButtons
                  config={{
                  alignment: 'center',  // alignment of buttons (left, center, right)
                  color: 'social',      // set the color of buttons (social, white)
                  enabled: true,        // show/hide buttons (true, false)
                  font_size: 14,        // font size for the buttons
                  labels: 'cta',        // button labels (cta, counts, null)
                  language: 'en',       // which language to use (see LANGUAGES)
                  networks: [           // which networks to include (see SHARING NETWORKS)
                    'twitter',
                    'linkedin',
                    'facebook',
                    'email',
                    'reddit',
                    // 'whatsapp',
                  ],
                  padding: 2,          // padding within buttons (INTEGER)
                  radius: 4,            // the corner radius on each button (INTEGER)
                  show_total: false,
                  size: 24,             // the size of each button (INTEGER)

                  // OPTIONAL PARAMETERS
                  url: this.apiUrlLink(), // (defaults to current url)
                  image: this.agoraLogoUrl(),  // (defaults to og:image or twitter:image)
                  description: this.Description(),       // (defaults to og:description or twitter:description)
                  title: this.Title(),            // (defaults to og:title or twitter:title)
                  message: this.emailMessage(),     // (only for email sharing)
                  subject: this.emailTitle(),  // (only for email sharing)
                  username: this.twitterUsername() // (only for twitter sharing)
                  }}
          />
          <Box
                onClick={() => {navigator.clipboard.writeText(this.urlLink()); }}
                data-tip data-for='save_url_event'
                background="#5AAB61"
                round="xsmall"
                width="50px" height="24px"
                margin={{left: "2px"}}
                justify="center"
                align="center"
                focusIndicator={true}
                hoverIndicator={{color: "#62DB69"}}
                >
                <LinkIcon style={{width: 18, height: 18, stroke: "white"}} />
            </Box>
            <ReactTooltip id="save_url_event" effect="solid">
              Click to copy URL!
            </ReactTooltip>
        </Box>
      )
    }
}