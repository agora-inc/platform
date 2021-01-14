import React, { Component } from "react";
import { Box, Text, Button, Layer, Image} from "grommet";
import {InlineShareButtons} from 'sharethis-reactjs';
import ReactTooltip from "react-tooltip";
import {Talk} from "../../Services/TalkService";
import { Calendar, Workshop, UserExpert, LinkNext, FormNextLink, Link as LinkIcon, Channel} from "grommet-icons";
import { Helmet } from "react-helmet";


interface Props {
    sharedContent: any;
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
  
    //True if talk, therefore false if channel.
    isTalk = (variableToCheck: any): variableToCheck is Talk => {
      return (variableToCheck as Talk).talk_speaker !== undefined;
    }

    urlLink = () => {
      if(this.isTalk(this.props.sharedContent)) {
      return `https://agora.stream/event/${this.props.sharedContent.id}`
      } else {
        const name = this.props.sharedContent.name.replace(/\s/g, '%20')
        return `https://agora.stream/${name}`
      }
    }

    emailTitle = () => {
      if(this.isTalk(this.props.sharedContent)) {
        return `Talk that might be of interest to you`
      } else {
        return `An Agora that might be of interest to you`
      }
    }

    emailMessage = () => {
      return `Hey, check this out: ${this.urlLink()}`
    }

    Description = () => {
      // TODO: ADD DATE, ADD URL, RENDER LATEX
      return this.props.sharedContent.description
    }

    Title = () => {
      return this.props.sharedContent.name
    }

    agoraLogoUrl = () => {
        return `https://agora.stream/api/channels/avatar?channelId=${this.props.sharedContent.channel_id}&ts=2`
    }

    twitterUsername = () => {
      if(this.isTalk(this.props.sharedContent)) {
        return this.props.sharedContent.channel_name;
      } else {
        return "agora.stream";
      }
    }

    render () {
      return (
        <Box 
          direction="row"
          style = {{ zIndex: 0 }}
        >
          <Helmet>
            <title>{this.Title()}</title>
            <meta property="url" content={this.urlLink()} />
            <meta property="title" content={this.Title()} />
            <meta name="description" content={this.Description()} />
            <meta property="image" content={this.agoraLogoUrl()} />
            <meta property="og:title" content={this.Title()} />
            <meta property="og:image" content={this.agoraLogoUrl()} />
            <meta property="og:url" content={this.urlLink()} />
            <meta property="og:description" content={this.Description()} />
          </Helmet>
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
                  url: this.urlLink(), // (defaults to current url)
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