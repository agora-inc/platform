import React, { Component } from "react";
import { Box, Text } from "grommet";
import { RouteComponentProps } from "react-router-dom";

import { ChannelService, Channel } from "../Services/ChannelService"



interface Props extends RouteComponentProps {
  }
  
  interface State {
      status: string,
      mode: string,
      plan: string,
      channel: Channel,
      dataIsFetched: boolean
  }
  
  export default class AfterTransaction extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
          status : "pending",
          mode : this.props.location.pathname.split("/")[4].toLowerCase(),
          plan : this.props.location.pathname.split("/")[5].toLowerCase(),
          channel: {
            id: Number(this.props.location.pathname.split("/")[3]),
            name: "",
            description: "",
            long_description: "",
            colour: "",
            has_avatar: false,
            has_cover: false,
            topics: []
          },
          dataIsFetched: false
      }
    }

    componentDidMount = () => {
        ChannelService.getChannelById(this.state.channel.id,
            (channel: Channel) => {
                this.setState({
                    channel: channel,
                    status: this.props.location.pathname.split("/")[2].toLowerCase(),
                    dataIsFetched: true 
                }, ()=> {})
            }
        )
    }

    onSuccess = () => {
        var channelUrl = `https://agora.stream/${this.state.channel.name}`
        return (
            <Box align="center" margin={{top:"80px"}} >
                <Box width="40%">
                    {/* Thank you with picture */}
                    <Text size="36px" alignSelf="center">🎉Success!🎉</Text>
                    <Box>
                        <img src="/images/academic_seminars_photo.jpeg" 
                            width="100%" 
                            style={{
                            margin: "20px",
                            alignSelf: "center"}}
                            />
                    </Box>
                    
                    {/* Restate value of original offer */}
                    <Text size="14px">
                        <b>Your community just got empowered!</b> You can now enjoy the access of unlimited email reminders, hybrid streaming tech sculpted for academics, and much more!</Text>

                    {/* Clear instructions */}
                    <Box margin={{top: "14px"}}>
                        <Text size="14px" weight="bold">Next steps:</Text>
                        <ul>
                            <li>Go back on your <a href={channelUrl}> agora page and schedule your next events!</a></li>
                            <li>Attract future participants and speakers by sharing your page on social media!</li>
                            <li>Follow us on Twitter and Linkedin to hear about your new incoming features!</li>
                        </ul>
                    </Box>
                    <Text size="14px">
                        If you have any questions, please email <a href="mailto:team@agora.stream">team@agora.stream</a>.
                    </Text>
                </Box>
            </Box>
        )
    }

    onError = () => {
        return (
            <Box align="center" margin={{top:"80px"}} >
                <Box width="40%">
                    {/* Thank you with picture */}
                    <Text size="36px" alignSelf="center">Oops! Something went wrong...</Text>
                    <Box>
                        <img src="/images/error_icecream_photo.jpeg" 
                            width="100%" 
                            style={{
                            margin: "20px",
                            alignSelf: "center"}}
                            />
                    </Box>
                    
                    {/* Restate value of original offer */}
                    <Text size="14px">
                    If clearing your cache and trying again did not work, please send a short description of your problem to <a href="mailto:team@agora.stream">team@agora.stream</a> and we will get this sorted out as soon as possible!</Text>
                </Box>
            </Box>
        )
    }

    render() {
        if (this.state.dataIsFetched){
            return (
                <>
                    {(this.state.status == "success") && (this.onSuccess())}
                    {(this.state.status == "error") && (this.onError())}
                </>
            );
        } else {
            return (
                <>
                </>
            )
        }
      }
    }
    
