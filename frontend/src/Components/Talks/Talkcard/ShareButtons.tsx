import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import {InlineShareButtons} from 'sharethis-reactjs';
import ReactTooltip from "react-tooltip";
import {Talk} from "../../../Services/TalkService";
import { Calendar, Workshop, UserExpert, LinkNext, FormNextLink, Link as LinkIcon} from "grommet-icons";


interface Props {
    talk: Talk;
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
  
    urlTalk = () => {
      return `https://agora.stream/event/${this.props.talk.id}`
    }

    emailTitle = () => {
      return `Talk that might be of interest to you`
    }

    emailMessage = () => {
      return `Hey, check this out: ${this.urlTalk()}
      `
    }

    eventDescription = () => {
      // TODO: ADD DATE, ADD URL, RENDER LATEX
      return this.props.talk.description
    }

    eventTitle = () => {
      return this.props.talk.name
    }

    agoraLogoUrl = () => {
      return `https://agora.stream/api/channels/avatar?channelId=${this.props.talk.channel_id}&ts=2`
    
    }

    render () {
      return (
        <Box direction="row">
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
                  padding: 8,          // padding within buttons (INTEGER)
                  radius: 4,            // the corner radius on each button (INTEGER)
                  show_total: false,
                  size: 40,             // the size of each button (INTEGER)

                  // OPTIONAL PARAMETERS
                  url: this.urlTalk(), // (defaults to current url)
                  image: this.agoraLogoUrl(),  // (defaults to og:image or twitter:image)
                  description: this.eventDescription(),       // (defaults to og:description or twitter:description)
                  title: this.eventTitle(),            // (defaults to og:title or twitter:title)
                  message: this.emailMessage(),     // (only for email sharing)
                  subject: this.emailTitle(),  // (only for email sharing)
                  username: 'agora.stream' // (only for twitter sharing)
                  }}
          />
          <Box
                onClick={() => {navigator.clipboard.writeText(`https://agora.stream/event/${this.props.talk.id}`); }}
                data-tip data-for='save_url_event'
                background="white"
                round="xsmall"
                pad={{ bottom: "6px", top: "6px", left: "18px", right: "18px" }}
                justify="center"
                align="end"
                focusIndicator={true}
                style={{
                  border: "1px solid #C2C2C2",
                }}
                hoverIndicator={true}>
                <LinkIcon size="medium"/>
            </Box>
            <ReactTooltip id="save_url_event" effect="solid">
              Click to copy Event URL!
            </ReactTooltip>
        </Box>
      )
    }
}