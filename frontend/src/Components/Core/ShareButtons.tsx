import React, { Component } from "react";
import { Box, Text, Button, Layer, Image } from "grommet";
import { InlineShareButtons, StickyShareButtons } from "sharethis-reactjs";
import ReactTooltip from "react-tooltip";
import { Talk } from "../../Services/TalkService";
import { Channel } from "../../Services/ChannelService";
import {
  Calendar,
  Workshop,
  UserExpert,
  LinkNext,
  FormNextLink,
  Link as LinkIcon,
  Channel as ChannelIcon,
} from "grommet-icons";
import { threadId } from "worker_threads";
import { baseApiUrl } from "../../config";
import CopyUrlButton from "./ShareButtons/CopyUrlButton";

interface Props {
  talk?: Talk | any;
  channel?: Channel | any;
  referral?: boolean;
  height?: string;
  width?: string;
  widthPixel?: number;
  useReducedHorizontalVersion?: boolean;
  windowWidth?: number;
}

interface State {
  title: string;
  description: string;
  emailTitle: string;
  emailMessage: string;
  imageUrl: string;
  showShareButtons: boolean;
}

export default class ShareButtons extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: "",
      description: "",
      emailTitle: "",
      emailMessage: "",
      imageUrl: "",
      showShareButtons: true,
    };
  }

  urlLink = () => {
    if (this.props.talk) {
      return `https://mora.stream/event/${this.props.talk.id}`;
    } else if (this.props.channel) {
      if (this.props.referral) {
        const channelId = this.props.channel.id;
        return `https://mora.stream/referral/channel/${channelId}`;
      } else {
        const name = this.props.channel.name.replace(/\s/g, "%20");
        return `https://mora.stream/${name}`;
      }
    } else {
      return "https://mora.stream/";
    }
  };

  apiUrlLink = () => {
    if (this.props.talk) {
      let url = baseApiUrl + `/event-link?eventId=${this.props.talk.id}`;
      return url;
    } else if (this.props.channel) {
      if (this.props.referral) {
        const channelId = this.props.channel.id;
        return `https://mora.stream/referral/channel/${channelId}`;
      } else {
        let url =
          baseApiUrl + `/channel-link?channelId=${this.props.channel.id}`;
        return url;
      }
    } else {
      return baseApiUrl;
    }
  };

  emailTitle = () => {
    if (this.props.talk) {
      return `Talk that might be of interest to you`;
    } else if (this.props.channel) {
      return `An Agora that might be of interest to you`;
    } else {
      return `Check out this new hybrid seminar platform`;
    }
  };

  emailMessage = () => {
    if (this.props.talk) {
      return `Hey, check this out: ${this.urlLink()}`;
    } else if (this.props.channel) {
      return `Hey, check this out: ${this.urlLink()}`;
    } else {
      return `Here is the link: ${this.urlLink()}`;
    }
  };

  description = () => {
    // TODO: ADD DATE, ADD URL, RENDER LATEX
    if (this.props.talk) {
      return this.props.talk.description;
    } else if (this.props.channel) {
      return this.props.channel.description;
    } else {
      return (
        "mora.stream is a public place where new ideas are" +
        "debated, discovered, and broadcasted to an international physical/online audience."
      );
    }
  };

  title = () => {
    if (this.props.talk) {
      return this.props.talk.name;
    } else if (this.props.channel) {
      return this.props.channel.name;
    } else {
      return "mora.stream";
    }
  };

  agoraLogoUrl = () => {
    if (this.props.talk) {
      return `https://mora.stream/api/channels/avatar?channelId=${this.props.talk.ChannelIcon_id}&ts=2`;
    } else if (this.props.channel) {
      return `https://mora.stream/api/channels/avatar?channelId=${this.props.channel.id}`;
    }
  };

  twitterUsername = () => {
    if (this.props.talk) {
      return this.props.talk.channel_name;
    } else if (this.props.channel) {
      return "mora.stream";
    }
  };

  displayShareButtons = () => {
    this.setState({ showShareButtons: !this.state.showShareButtons });
  };

  render() {
    var useReducedHorizontalVersion = this.props.useReducedHorizontalVersion
      ? this.props.useReducedHorizontalVersion
      : false;
    if (!useReducedHorizontalVersion) {
      return (
        <Box
          direction="row"
          style={{ zIndex: 0 }}
          width={
            this.props.windowWidth && this.props.windowWidth < 480
              ? "unset"
              : "275px"
          }
          // alignSelf="end"
          gap="10px"
        >
          <CopyUrlButton
            url={this.urlLink()}
            height={this.props.height ? this.props.height : "35px"}
            width={this.props.width ? this.props.width : "100px"}
          />

          {/*<Button
              data-tip data-for='share_social'
              label="Share"
              onClick={this.displayShareButtons}
              style={{
                width: 140,
                height: 35,
                fontSize: 15,
                fontWeight: "bold",
                padding: 0,
                // margin: 6,
                backgroundColor: "#F2F2F2",
                border: "none",
                borderRadius: 7,
              }}
            />*/}
          <Box
            data-tip
            data-for="share_social"
            onClick={this.displayShareButtons}
            background={"#d5d5d5"}
            round="xsmall"
            width={this.props.width ? this.props.width : "100px"}
            height={this.props.height ? this.props.height : "35px"}
            justify="center"
            align="center"
            focusIndicator={true}
            hoverIndicator="#BAD6DB"
          >
            <Text weight="bold" size="15px">
              Share
            </Text>
          </Box>

          <ReactTooltip id="share_social" effect="solid" place="bottom">
            Share with friends and colleagues
          </ReactTooltip>

          {(this.state.showShareButtons && this.props.talk !== null) || (
            <StickyShareButtons
              config={{
                alignment: "right", // alignment of buttons (left, right)
                color: "white", // set the color of buttons (social, white)
                enabled: true, // show/hide buttons (true, false)
                font_size: 14, // font size for the buttons
                // hide_desktop: false,  // hide buttons on desktop (true, false)
                labels: "cta", // button labels (cta, counts, null)
                language: "en", // which language to use (see LANGUAGES)
                min_count: 0, // hide react counts less than min_count (INTEGER)
                networks: [
                  // which networks to include (see SHARING NETWORKS)
                  "twitter",
                  "linkedin",
                  "whatsapp",
                  "facebook",
                  "email",
                ],
                padding: 12, // padding within buttons (INTEGER)
                radius: 4, // the corner radius on each button (INTEGER)
                show_total: false, // show/hide the total share count (true, false)
                show_mobile: true, // show/hide the buttons on mobile (true, false)
                show_toggle: false, // show/hide the toggle buttons (true, false)
                size: 48, // the size of each button (INTEGER)
                top: 150, // offset in pixels from the top of the page

                // OPTIONAL PARAMETERS
                url: this.apiUrlLink(), // (defaults to current url)
                image: this.agoraLogoUrl(), // (defaults to og:image or twitter:image)
                description: this.description(), // (defaults to og:description or twitter:description)
                title: this.title(), // (defaults to og:title or twitter:title)
                message: this.emailMessage(), // (only for email sharing)
                subject: this.emailTitle(), // (only for email sharing)
                username: this.twitterUsername(), // (only for twitter sharing)
              }}
            />
          )}
        </Box>
      );
    } else {
      var widthPixel = this.props.widthPixel ? this.props.widthPixel : 48;
      return (
        <InlineShareButtons
          config={{
            alignment: "right", // alignment of buttons (left, right)
            color: "white", // set the color of buttons (social, white)
            enabled: true, // show/hide buttons (true, false)
            font_size: 14, // font size for the buttons
            // hide_desktop: false,  // hide buttons on desktop (true, false)
            labels: "cta", // button labels (cta, counts, null)
            language: "en", // which language to use (see LANGUAGES)
            // min_count: 0,         // hide react counts less than min_count (INTEGER)
            networks: [
              // which networks to include (see SHARING NETWORKS)
              "twitter",
              "linkedin",
              "whatsapp",
              "facebook",
              "email",
            ],
            padding: 12, // padding within buttons (INTEGER)
            radius: 4, // the corner radius on each button (INTEGER)
            show_total: false, // show/hide the total share count (true, false)
            // show_mobile: true,    // show/hide the buttons on mobile (true, false)
            // show_toggle: false,    // show/hide the toggle buttons (true, false)
            size: widthPixel, // the size of each button (INTEGER)
            // top: 150,             // offset in pixels from the top of the page

            // OPTIONAL PARAMETERS
            url: this.apiUrlLink(), // (defaults to current url)
            image: this.agoraLogoUrl(), // (defaults to og:image or twitter:image)
            description: this.description(), // (defaults to og:description or twitter:description)
            title: this.title(), // (defaults to og:title or twitter:title)
            message: this.emailMessage(), // (only for email sharing)
            subject: this.emailTitle(), // (only for email sharing)
            username: this.twitterUsername(), // (only for twitter sharing)
          }}
        />
      );
    }
  }
}
