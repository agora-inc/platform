import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Image } from "grommet";
import { User, UserService } from "../Services/UserService";
import { Channel, ChannelService } from "../Services/ChannelService";
import { Talk, TalkService } from "../Services/TalkService";
import { ChannelSubscriptionService } from "../Services/ChannelSubscriptionService";
import { StreamingProductService } from "../Services/StreamingProductService";
import { Link } from "react-router-dom";
import "../Styles/channel-page.css";
import { Calendar, Workshop, UserExpert } from "grommet-icons";
import Countdown from "../Components/Talks/Countdown";
import FooterOverlay from "../Components/Talks/Talkcard/FooterOverlay";
import CoffeeHangoutRoom from "../Components/Talks/TalkSharingPage/CoffeeHangoutRoom";
import { textToLatex } from "../Components/Core/LatexRendering";
import { Helmet } from "react-helmet";

interface Props {
  location: { pathname: string };
  streamId: number;
}

interface State {
  channel: Channel | null;
  talk: Talk;
  role: "none" | "owner" | "member" | "follower";
  user: User | null;
  available: boolean;
  registered: boolean;
  registrationStatus: string;
  showTalkId: number;
  allPlansId: number[];
  subscriptionPlans: string[];
}

export default class TalkSharingPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channel: null,
      role: "none",
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
      available: false,
      registered: false,
      registrationStatus: "",
      showTalkId: this.getTalkIdFromUrl(),
      allPlansId: [],
      subscriptionPlans: [],
    };
  }

  componentWillMount() {
    this.fetchAll()
  }

  getTalkIdFromUrl = (): number => {
    let talkId = Number(this.props.location.pathname.split("/")[2]);
    if (!talkId) {
      return -1;
    }
    return Number(talkId);
  };

  getChannelSubscriptions = () => {
    ChannelSubscriptionService.getAllActiveSubscriptionsForChannel(
      this.state.talk.channel_id, 
      (allPlansId: number[]) => {
        this.setState({ allPlansId })
        this.setState({
          subscriptionPlans: this.getChannelSubscriptionTiers(allPlansId)
        })
      }
    );
  }

  getChannelSubscriptionTiers = (allPlansId: number[]) => {
    let tiers: string[] = []
    allPlansId.map((id: number) => {
      StreamingProductService.getStreamingProductById(
        id, 
        (product: any) => {
          tiers.push(product.tier)
        }
      )
    })
    return tiers
  }

  fetchAll = () => {
    let talkId = this.getTalkIdFromUrl();  
    TalkService.getTalkById(talkId, (talk: Talk) => {
        this.setState({talk: talk}, 
          () => {
            this.fetchUserInfo();
            this.getChannelSubscriptions();
          }
        );
    });
  }

  fetchUserInfo = () => {
    if (this.state.user) {
      ChannelService.getRoleInChannel(
        this.state.user.id, 
        this.state.talk.channel_id, 
        (role: "none" | "owner" | "member" | "follower") => {
          this.setState({role: role})
        }
      );

      TalkService.isAvailableToUser(
        this.state.user.id,
        this.state.talk.id,
        (available: boolean) => {
          this.setState({ available });
        }
      );

      TalkService.registrationStatusForTalk(
        this.state.talk.id,
        this.state.user.id,
        (status: string) => {
          this.setState({ 
            registered: (status === "accepted"),
            registrationStatus: status 
          });
        }
      );
    }
  }

  formatDateFull = (s: string, e: string) => {
    const start = new Date(s);
    const dateStartStr = start.toDateString().slice(0, -4);
    const timeStartStr = start.toTimeString().slice(0, 5);
    const end = new Date(e);
    const dateEndStr = end.toDateString().slice(0, -4);
    const timeEndStr = end.toTimeString().slice(0, 5);
    return `${dateStartStr} ${timeStartStr} - ${timeEndStr} `;
  };

  render() { 
    const talk = this.state.talk;
    var renderMobileView = (window.innerWidth < 800);
    
      return(
        <>
        <Helmet>
          <title>{talk.name}</title>
          <meta name="description" content={talk.description}/>
          <meta property="og:title" content={talk.name} />
          <meta property="og:description" content={talk.description} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={document.location.href} />
          {/* <meta property="og:image" content={ChannelService.getAvatar(talk.channel_id)} /> */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={talk.name} />
          <meta name="twitter:description" content={talk.description} />
        </Helmet>
        <Box
          margin={{
            top: "10vh", 
            left: "20px", 
            right: "20px"
          }}
          align="center"
        >
          <Box
            width={renderMobileView ? "100vw" : "60vw"}
            margin={{left: "20px", right: "20px", bottom: "30px"}}
          >
            <Box 
              direction="row" 
              gap="xsmall" 
              style={{ minHeight: "40px" }}
            >
              <Link
                className="channel"
                to={`/${this.state.talk.channel_name}`}
                style={{ textDecoration: "none" }}
              >
                <Box
                  direction="row"
                  gap="xsmall"
                  align="center"
                  round="xsmall"
                  pad={{ vertical: "6px", horizontal: "6px" }}
                >
                  <Box
                    justify="center"
                    align="center"
                    background="#efeff1"
                    overflow="hidden"
                    style={{
                        minHeight: 30,
                        minWidth: 30,
                        borderRadius: 15,
                    }}
                  >
                    <img
                      src={ChannelService.getAvatar(
                          this.state.talk.channel_id
                      )}
                      height={30}
                      width={30}
                    />
                  </Box>
                  <Box justify="between">
                    <Text weight="bold" size="18px" color="grey">
                      {this.state.talk.channel_name}
                    </Text>
                  </Box>
                </Box>
              </Link>
            </Box>
            <Text
              weight="bold"
              size="21px"
              color="black"
              style={{
                minHeight: "50px",
                maxHeight: "120px",
                overflowY: "auto",
              }}
              margin={{ bottom: "5px", top: "10px" }}
            >
              {this.state.talk.name}
            </Text> 

            {this.state.talk.talk_speaker_url && (
              <a href={this.state.talk.talk_speaker_url} target="_blank">
                <Box
                  direction="row"
                  gap="small"
                  onClick={() => {}}
                  hoverIndicator={true}
                  pad={{ left: "6px", top: "4px" }}
                >
                  <UserExpert size="18px" />
                  <Text
                    size="18px"
                    color="black"
                    style={{
                      height: "24px",
                      overflow: "auto",
                      fontStyle: "italic",
                    }}
                  >
                    {this.state.talk.talk_speaker
                      ? this.state.talk.talk_speaker
                      : "TBA"}
                  </Text>
                </Box>
              </a>
            )}

            {!this.state.talk.talk_speaker_url && (
              <Box direction="row" gap="small">
                <UserExpert size="18px" />
                <Text
                  size="18px"
                  color="black"
                  style={{
                    height: "30px",
                    overflow: "auto",
                    fontStyle: "italic",
                  }}
                  margin={{ bottom: "10px" }}
                >
                  {this.state.talk.talk_speaker
                    ? this.state.talk.talk_speaker
                    : "TBA"}
                </Text>
              </Box>
            )}

            <Text
              size="16px"
              color="black"
              style={{
                minHeight: "50px",
                // maxHeight: "200px",
                // overflowY: "auto",
              }}
              margin={{ top: "10px", bottom: "10px" }}
            >
              {this.state.talk.description.split('\n').map(
                (item, i) => textToLatex(item)
              )}
            </Text>

            <FooterOverlay
              talk={this.state.talk}
              user={this.state.user}
              role={this.state.role}
              available={this.state.available}
              registered={this.state.registered}
              registrationStatus={this.state.registrationStatus}
              isSharingPage={true}
            />

          <CoffeeHangoutRoom
            talk={this.state.talk}
            user={this.state.user}
            disabled={!this.state.subscriptionPlans.includes("tier1") && 
              this.state.subscriptionPlans.includes("tier2")}
          />
          </Box>
        </Box>
      </>
      )
    }
}