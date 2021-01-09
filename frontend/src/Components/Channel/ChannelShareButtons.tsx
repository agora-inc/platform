import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import {InlineShareButtons} from 'sharethis-reactjs';
import ReactTooltip from "react-tooltip";
import { Channel } from "../../Services/ChannelService"
import { Calendar, Workshop, UserExpert, LinkNext, FormNextLink, Link as LinkIcon} from "grommet-icons";


interface Props {
    channel: Channel;
  }
  
  interface State {
    title: string;
    description: string;
    emailTitle: string;
    emailMessage: string;
    imageUrl: string

  }
  
  export default class ChannelShareButtons extends Component<Props, State> {
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
  
    urlAgora = () => {
      const name = this.props.channel.name.replace(/\s/g, '%20')
      return `https://agora.stream/${name}`
    }

    emailTitle = () => {
      return `Agora that might be of interest to you`
    }

    emailMessage = () => {
      return `Hey, check this out: ${this.urlAgora()}`
    }

    eventDescription = () => {
      // TODO: ADD DATE, ADD URL, RENDER LATEX
      return this.props.channel.description
    }

    eventTitle = () => {
      return this.props.channel.name
    }

    agoraLogoUrl = () => {
      return `https://agora.stream/api/channels/avatar?channelId=${this.props.channel.id}&ts=2`
    
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
                    //'reddit',
                    // 'whatsapp',
                  ],
                  padding: 2,          // padding within buttons (INTEGER)
                  radius: 4,            // the corner radius on each button (INTEGER)
                  show_total: false,
                  size: 24,             // the size of each button (INTEGER)

                  // OPTIONAL PARAMETERS
                  url: this.urlAgora(), // (defaults to current url)
                  image: this.agoraLogoUrl(),  // (defaults to og:image or twitter:image)
                  description: this.eventDescription(),       // (defaults to og:description or twitter:description)
                  title: this.eventTitle(),            // (defaults to og:title or twitter:title)
                  message: this.emailMessage(),     // (only for email sharing)
                  subject: this.emailTitle(),  // (only for email sharing)
                  username: 'agora.stream' // (only for twitter sharing)
                  }}
          />
          <Box width="6px"></Box>
          <Box
                onClick={() => {navigator.clipboard.writeText(`https://agora.stream/${this.props.channel.name.replace(/\s/g, '%20')}`); }}
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
                <LinkIcon style={{width: 15, height: 15, stroke: "white"}} />
            </Box>
            <ReactTooltip id="save_url_event" effect="solid">
              Click to copy URL!
            </ReactTooltip>
        </Box>
      )
    }
}