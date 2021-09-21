import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid } from "grommet";
import { CaretNext, Twitter, Linkedin, Checkmark } from "grommet-icons";
import DonorButton from "../Components/Core/DonorButton"
import ShareButtons from "../Components/Core/ShareButtons";
import moraStreamFullLogo from "../assets/general/mora.stream_logo_v2.1.svg";
import seminarPhoto from "../assets/agoraCreationPage/academic_seminars_photo.jpeg"


interface Props {
  location: { state: { user: User } };
}

interface State {
  loading: boolean;
  text: string;
  sizeHeader: string;
  sizeItem: string,
  sizeText: string;
  agoraCreationOverlay:
    {
      showCreateChannelOverlay: boolean
    }
}

export default class InformationPage extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      text: "",
      sizeHeader: "42px",
      sizeItem: "16px",
      sizeText: "14px",
      agoraCreationOverlay:
        {
          showCreateChannelOverlay: false
        }
    };
  }

  componentWillMount() {
  }


  render() {
    var renderMobileView = (window.innerWidth < 1000);

    return (

      <Box
        width="120vw"
        height="auto"
        align="center"
        margin={{ top: "8vh" }}
        // background="color6"
        >
        <video
          autoPlay loop muted id="background-landing"
          style={{ height: "auto", width: "auto", minWidth: "100%", minHeight: "100%" }}
        >
          <source src="https://video.wixstatic.com/video/9b9d14_37244669d1c749ab8d1bf8b15762c61a/720p/mp4/file.mp4" type="video/mp4" />
        </video>

        <Box width={renderMobileView ? "85%" : "75%"} direction="column" margin={{top: "80px"}}>
          <Box direction="row" gap="small" margin={{bottom: "36px"}}>
            <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
              Our vision 🌱
            </Text>
          </Box>
          <Text weight="bold" size="22px" margin={{bottom: "36px", left: "15px"}}>
            A public place where new ideas are debated, discovered, and broadcasted to an international physical/online audience.
            {/* Hybrid seminars where new ideas are debated, discovered, and broadcasted to an international audience. */}
          </Text>

            <img src={seminarPhoto} 
              style={{
                width: "70%", 
                alignSelf: "left", 
                marginLeft: "15px",
                marginTop: renderMobileView ? "15px" : "30px", 
                marginBottom: renderMobileView ? "55px" : "0px"}}
            />

          
            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "100px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
              Our mission 🌎
              </Text>
            </Box>


            <Grid
              rows={
                renderMobileView 
                ?  [
                    "auto", "auto", "auto", "auto", "auto"
                  ]
                : [
                    "auto", "auto", 
                  ]
              }
              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap={renderMobileView ? "0px" : "50px"}
              margin={renderMobileView ? {} : {left: "15px"}}
              areas={ renderMobileView 
                ?
                  [
                    { name: 'block_1', start: [0, 0], end: [0, 1] },
                    { name: 'block_2', start: [0, 1], end: [0, 2] },

                    { name: 'block_3', start: [0, 2], end: [0, 3] },
                    { name: 'block_4', start: [0, 3], end: [0, 4] },
                  ]
                :
                  [
                    { name: 'block_1', start: [0, 0], end: [0, 0] },
                    { name: 'block_2', start: [0, 1], end: [0, 1] },

                    { name: 'block_3', start: [1, 0], end: [1, 0] },
                    { name: 'block_4', start: [1, 1], end: [1, 1] },
                ]
            }
            >

              <Box gridArea="block_4" alignContent="start" margin={{bottom: "20px"}}>
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Provide a gateway to social academic events
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  Scientists originally created the World Wide Web to facilitate the communication of and around international research.
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  Since 1989, the internet has radically transformed our everyday lives. Despite this, with regards to research, 
                  not much progress has been made toward its primary goal.
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  At mora, we believe in leveraging modern technologies to empower academics to connect, 
                  exchange and debate new ideas anywhere on Earth.
                </Text>
              </Box>

              <Box gridArea="block_3" alignContent="start" margin={{bottom: "20px"}}>
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Give an equal chance to every academic to be part of any community
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  Not every researcher has access to top-notch seminars at their university. 
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  Collaborations and the ideas that follow as a direct result are most often formed over a coffee after a presentation. 
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                In this respect, online streaming technologies can facilitate the rise of talented researchers, regardless of where they are.
                </Text>
              </Box>

              <Box gridArea="block_2" alignContent="start" margin={{bottom: "20px"}}>
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Facilitate cross-subject collaborations
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  Ground-breaking results often stem from the boundary of ideas from different fields.
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  In order for them to meet, there must be some conscious organisational effort.
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  The solution? A centralised place where researchers can hop from one seminar to another in just a few clicks.
                </Text>
              </Box>

              <Box gridArea="block_1" alignContent="start" margin={{bottom: "20px"}}>
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Empower the social component of research
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  COVID-19 raised awareness that researchers benefit from online seminars.
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  The majority of research groups that went online saw their audience multiply and enjoyed the 
                  many advantages that come with it, such as the consistent presence of world-class experts.
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  As restrictions are lifted, academics want to integrate this experience with that of familiar 
                  in-person seminars with their colleagues next door.  
                </Text>
                <Text size="16px" margin={{bottom: "10px"}}>
                  The solution? A hybrid streaming technology tailored to academic seminars, where a virtual and 
                  physical audience can interact and empower one another.
                </Text>
              </Box>
            </Grid>



            <Box gap="small" margin={{bottom: "24px", top: (renderMobileView ? "50px" : "100px") }}>
              <Text size={this.state.sizeHeader} margin={{bottom: "24px"}} weight="bold" color="color1"> 
              Our values 💛
              </Text>
              <Box alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px", left: "15px"}}>
                  We want to make a positive difference in the world of research.
                </Text>
              </Box>
              <Box alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px", left: "15px"}}>
                  We are bold and build products we believe in.
                </Text>
              </Box>
              <Box alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px", left: "15px"}}>
                  We believe in full transparency and honest communication.
                </Text>
              </Box>
            </Box>

            <Box direction="row" gap="small" margin={{bottom: "36px", top: (renderMobileView ? "50px" : "50px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Become part of the revolution 💪
              </Text>
            </Box>

            <Box gap="small">
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <CaretNext size="25px" />
                  <Text size="25px"> <b>Tell</b> about 
                    <img src={moraStreamFullLogo} style={{ height: "30px", marginLeft: 8, marginRight: 10, marginBottom: -8 }}/> 
                    to all your friends and colleagues 
                  </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <CaretNext size="25px" />
                  <Text size="25px"> <b>Organise</b> and share your seminars with 
                    <img src={moraStreamFullLogo} style={{ height: "30px", marginLeft: 8, marginRight: 10, marginBottom: -8 }}/>  
                  </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <CaretNext size="25px" />
                  <Text size="25px"> <b>Follow</b> us on <a href="https://www.linkedin.com/company/morastream"><Linkedin/></a> and <a href="https://twitter.com/morastream"><Twitter/></a> to hear out about next trending seminars and the release of new features</Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Box direction="row" alignContent="start" height="18px">
                    <CaretNext size="25px" /><Box width="10px"></Box>
                    <Text size="25px">  <b>Help us</b> grow faster by </Text><Box width="10px"></Box><DonorButton callback={()=> {}} text={"donating!"}/>
                  </Box>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "20px"}} align="center">
                  <CaretNext size="25px" />
                  <Text size="25px"> <b>Tell</b> about 
                    <img src={moraStreamFullLogo} style={{ height: "30px", marginLeft: 8, marginRight: 10, marginBottom: -8 }}/> 
                    to all your friends and colleagues 
                  </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "45px", top: "10px"}} align="center">
                  <ShareButtons
                      talk={null}
                      channel={null}
                      useReducedHorizontalVersion={true}
                      widthPixel={40}
                    />
                </Box>
              </Box>

              <Box direction="row" gap="small" margin={{bottom: "36px", top: (renderMobileView ? "100px" : "150px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                About us 👨‍👩‍👧‍👦
              </Text>
            </Box>
            <Box margin={{bottom: "150px"}}>
              <Text size="25px">
                  We are a team of researchers at Imperial College London and the University of Oxford who believe in a connected world where ideas are shared in a efficient way.
                </Text>
            </Box>
          </Box>

        </Box>






      
    );
  }
}
