import React, { Component } from "react";
import { Box, Button, Text, Layer } from "grommet";
import MediaQuery from "react-responsive";
import { User } from "../../../Services/UserService";
import { Talk, TalkService } from "../../../Services/TalkService";
import CoffeeHangoutButton from "./CoffeeHangoutRoom/CoffeeHangoutButton";
import PricingPlans from "../../../Views/PricingPlans";
// import { time } from "node:console";

interface Props {
    user: User | null;
    talk: Talk;
    disabled: boolean;
}
  
interface State {
    now: Date;
    openingTimeBeforeSemInMinutes: number;
    openingTimeAfterSemInMinutes: number;
    showModalPricing: boolean;
  }


export default class CoffeeHangoutRoom extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        now: new Date(),
        openingTimeBeforeSemInMinutes: 45,
        openingTimeAfterSemInMinutes: 120,
        showModalPricing: false,
      };
    }

    // cafeteriaOpened() {
    //     // Showing link 30 minutes before seminar starts and 2 hours after
    //     // NOTE: difference between times are given in seconds.
    //     var startTime = new Date(this.props.talk.date).getTime()
    //     var endTime = new Date(this.props.talk.end_date).getTime()
    //     var secondsBeforeSeminar = Math.floor((startTime - this.state.now.getTime() ) / 1000)
    //     var secondsAfterSeminar = Math.floor((this.state.now.getTime() - endTime ) / 1000)
    //     return ((secondsBeforeSeminar > 0 && secondsBeforeSeminar < this.state.openingTimeAfterSemInMinutes * 60))
    //     }

    toggleModalPricing = () => {
        this.setState({ showModalPricing: !this.state.showModalPricing });
    };

    cafeteriaPermanentlyClosed() {
        var startTime = new Date(this.props.talk.date).getTime()
        var endTime = new Date(this.props.talk.end_date).getTime()
    
        var secondsAfterSeminar = Math.floor((this.state.now.getTime() - endTime ) / 1000)
    
        return (secondsAfterSeminar > 0 && secondsAfterSeminar > this.state.openingTimeAfterSemInMinutes * 60)
        }

    render() {
        return (
            <>
                {/* {!this.cafeteriaPermanentlyClosed() || ( */}
                <Box align="start" margin={{top:"100px"}} pad="50px" background={this.props.disabled ? "#D3F930"  : "" }>
                    {this.props.disabled && (
                        <Box direction="row" align="center" gap="50px" margin={{bottom: "60px"}}>
                            <Text size="16px" style={{fontStyle: "italic"}} >
                                Unlock the access to the virtual cafeteria for your entire community
                            </Text>
                            
                            <Box
                                onClick={this.toggleModalPricing}
                                background="#BAD6DB"
                                round="xsmall"
                                pad="xsmall"
                                width="200px"
                                height="40px"
                                justify="center"
                                align="center"
                                focusIndicator={false}
                                hoverIndicator="#0C385B"
                            >
                                <Text size="14px" weight="bold"> Unlock virtual cafeteria </Text>
                            </Box>
                            {this.state.showModalPricing && (
                                <Layer
                                    onEsc={this.toggleModalPricing}
                                    onClickOutside={this.toggleModalPricing}
                                    modal
                                    responsive
                                    animation="fadeIn"
                                    style={{
                                    width: "1000px",
                                    height: "65%",
                                    borderRadius: 15,
                                    padding: 0,
                                    }}
                                >
                                    <PricingPlans 
                                    callback={this.toggleModalPricing}
                                    disabled={false}
                                    channelId={this.props.talk.channel_id}
                                    userId={this.props.user ? this.props.user.id : null}
                                    showDemo={false}
                                    headerTitle={false}
                                    />

                                </Layer>
                            )}
                        </Box>
                    )}
                    <Box direction="row" gap="30px" align="center"> 
                        <Text size="18px" weight="bold" margin={{top:"20px", bottom: "10px"}}>
                            Meet the participants in the cafeteria after the seminar!
                        </Text>
                        <CoffeeHangoutButton
                            talk={this.props.talk}
                            user={this.props.user}
                            disabled={this.props.disabled}
                        />
                    </Box>
                    <video 
                        autoPlay loop muted
                        style={{ height: "auto", width: "90%", marginTop: "10px", marginBottom: "10px"}}
                        >
                        <source src="/videos/cafeteria_agora_minidemo.mp4" type="video/mp4"/> 
                    </video>
                </Box>
            </>
        )
    }
}