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
    windowWidth: number;
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
        var startTime = new Date(this.props.talk.date).getTime();
        var endTime = new Date(this.props.talk.end_date).getTime();

        var secondsAfterSeminar = Math.floor(
            (this.state.now.getTime() - endTime) / 1000
        );

        return (
            secondsAfterSeminar > 0 &&
            secondsAfterSeminar > this.state.openingTimeAfterSemInMinutes * 60
        );
    }

    render() {
        return (
            <>
                {/* {!this.cafeteriaPermanentlyClosed() || ( */}
                <Box
                    align="start"
                    margin={{ top: "100px" }}
                    pad="50px"
                    background={this.props.disabled ? "#BAD6DB" : ""}
                >
                    {this.props.disabled && (
                        <Box
                            direction={
                                this.props.windowWidth < 580 ? "column" : "row"
                            }
                            align="center"
                            gap="50px"
                            margin={{ bottom: "60px" }}
                        >
                            <Text size="16px" style={{ fontStyle: "italic" }}>
                                Unlock the access to the virtual cafeteria for
                                your entire community
                            </Text>

                            <Box
                                onClick={this.toggleModalPricing}
                                background="#D3F930"
                                hoverIndicator="#7BA59E"
                                round="xsmall"
                                pad="xsmall"
                                width={{ min: "200px" }}
                                height="40px"
                                justify="center"
                                align="center"
                                focusIndicator={false}
                            >
                                <Text size="14px" weight="bold">
                                    {" "}
                                    Unlock virtual cafeteria{" "}
                                </Text>
                            </Box>
                            {this.state.showModalPricing && (
                                <>
                                    {this.props.windowWidth < 769 && (
                                        <Box
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                                background: "#00000080",
                                            }}
                                            onClick={this.toggleModalPricing}
                                        ></Box>
                                    )}
                                    <Layer
                                        onEsc={this.toggleModalPricing}
                                        onClickOutside={this.toggleModalPricing}
                                        modal
                                        responsive
                                        animation="fadeIn"
                                        style={
                                            this.props.windowWidth < 769
                                                ? {
                                                      width:
                                                          this.props
                                                              .windowWidth < 500
                                                              ? "300px"
                                                              : "500px",
                                                      borderRadius: 15,
                                                      height: "500px",
                                                      padding: 0,
                                                      top: "50%",
                                                      left: "50%",
                                                      transform:
                                                          "translate(-50%, -50%)",
                                                  }
                                                : {
                                                      width: "750px",
                                                      height: "65%",
                                                      borderRadius: 15,
                                                      padding: 0,
                                                  }
                                        }
                                    >
                                        <PricingPlans
                                            callback={this.toggleModalPricing}
                                            disabled={false}
                                            channelId={
                                                this.props.talk.channel_id
                                            }
                                            userId={
                                                this.props.user
                                                    ? this.props.user.id
                                                    : null
                                            }
                                            showDemo={false}
                                            headerTitle={false}
                                            isMobile={
                                                this.props.windowWidth < 992
                                            }
                                        />
                                    </Layer>
                                </>
                            )}
                        </Box>
                    )}
                    <Box
                        direction={
                            this.props.windowWidth < 580 ? "column" : "row"
                        }
                        gap="30px"
                        align="center"
                    >
                        <Text
                            size="18px"
                            weight="bold"
                            margin={{ top: "20px", bottom: "10px" }}
                        >
                            Meet with speakers and attendees after the event!
                        </Text>
                        <CoffeeHangoutButton
                            talk={this.props.talk}
                            user={this.props.user}
                            disabled={this.props.disabled}
                        />
                    </Box>
                    <video
                        autoPlay
                        loop
                        muted
                        style={{
                            height: "auto",
                            width: "90%",
                            marginTop: "10px",
                            marginBottom: "10px",
                        }}
                    >
                        <source
                            src="/videos/cafeteria_agora_minidemo.mp4"
                            type="video/mp4"
                        />
                    </video>
                </Box>
            </>
        );
    }
}
