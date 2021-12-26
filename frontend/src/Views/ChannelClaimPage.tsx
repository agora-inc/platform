import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Box, Text, Heading, Layer } from "grommet";
import { Channel, ChannelService } from "../Services/ChannelService";
import CreateChannelButton from "../Components/Channel/CreateChannelButton";
import CreateChannelOverlay from "../Components/Channel/CreateChannelButton/CreateChannelOverlay";
import { Redirect } from "react-router-dom";
import Loading from "../Components/Core/Loading";
import ShareButtons from "../Components/Core/ShareButtons";
import LoginModal from "../Components/Account/LoginModal";
import SignUpButton from "../Components/Account/SignUpButton";
import { FaThemeisle } from "react-icons/fa";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

interface State {
  channel: Channel | null;
//   channelId: number;
  mailToken: string
  colorButton: string
  colorHover: string
  renderMobileView: boolean;
  showCreateChannelOverlay: boolean;
  viewCount: number;
  loading: boolean;
}

export default class ChannelClaimPage extends Component<RouteComponentProps, State> {
    constructor(props: any) {
      super(props);
      this.state = {
        renderMobileView: (window.innerWidth < 1200),
        channel: null,
        mailToken: new URL(window.location.href).searchParams.get("mailToken")!,
        colorButton: "color1",
        colorHover: "color5",
        showCreateChannelOverlay: false,
        viewCount: NaN,
        loading: true
      };
    }

    componentWillMount() {
        console.log(this.state.mailToken)
        if(this.state.mailToken !== ""){
          this.fetchChanneltoClaim();
        } else {
          this.setState( {
            channel: null,
            mailToken: "",
            loading: false
          })
        }
      }


    fetchChanneltoClaim = () => {
        let channelId = 0;
        ChannelService.getFetchedChannelForMailToken(this.state.mailToken, channelId);
        ChannelService.getChannelById(
          channelId,
          (channel: Channel) => {
            if (channel){
              this.setState(
                {
                  channel: channel,
                  },
                  () => {
                    try{
                      this.fetchChannelViewCount();
                      this.setState( {loading: false})
                    }
                    catch{
                      this.setState( {
                        channel: null,
                        loading: false})
                    }
                  }
                  );
            } else {
              this.setState( {loading: false})
            }
          }
        );
      };

      fetchChannelViewCount = () => {
        ChannelService.getViewCountForChannel(
          this.state.channel!.id,
          (viewCount: number) => {
            this.setState({ viewCount },
              () => {this.setState( {loading: false})});
          }
        );
      }; 

      componentDidUpdate(prevProps: RouteComponentProps) {
        if (this.props.location !== prevProps.location) {
          this.setState({
            mailToken: new URL(window.location.href).searchParams.get("mailToken")!
          });
        }
      }

      headTitle() {
        if(this.state.mailToken !== ""){
            return (
              <>
                <Text size="20px" color="grey" margin={this.state.renderMobileView ? {top: "80px"} : {top: "120px"}}>Don't leave your colleagues behind</Text>
                <Text size="48px" weight="bold" color="color1" margin={this.state.renderMobileView ? {top: "20px", bottom: "40px"} : {top: "20px", bottom: "50px"}}>
                Claim your channel 
                  <Text size="48px" color="color3">
                    {this.state.channel && ( " " + this.state.channel.name + " ")} 
                    {!this.state.channel && (" and interact with your community! ")} 
                  </Text>
                for free
                </Text>
            </>
            )
        } 
    }
}