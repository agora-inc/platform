import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid } from "grommet";
import { Checkbox, Twitter, Linkedin } from "grommet-icons";
import DonorButton from "../Components/Pricing/DonorButton"
import agoraStreamFullLogo from "../assets/general/agora.stream_logo_v2.1.png";
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
        id="pricing"
        width="100vw"
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

        <Box width={renderMobileView ? "85%" : "70%"} direction="column" margin={{top: "80px"}}>
          <Box direction="row" gap="small" margin={{bottom: "44px"}}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Our vision 🌱
              </Text>
            </Box>
            <Text weight="bold" size="22px">A couple clicks to open the doors of any physical or online academic seminars.</Text>

            <img src={seminarPhoto} style={{width: "180%", alignSelf: "center", marginTop: "80px"}}/>


            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "100px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
              Our missions 🌎
              </Text>
            </Box>


            <Grid
              rows={
                renderMobileView 
                ?  [
                    "auto", "auto", "auto", "auto"
                  ]
                : [
                    "auto", "auto", 
                  ]
              }
              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap={renderMobileView ? "0px" : "50px"}
              margin={renderMobileView ? {} : {left: "10px"}}
              areas={ renderMobileView 
                ?
                  [
                    { name: 'block_1', start: [0, 0], end: [0, 0] },
                    { name: 'block_2', start: [0, 1], end: [0, 1] },

                    { name: 'block_3', start: [0, 2], end: [0, 2] },
                    { name: 'block_4', start: [0, 3], end: [0, 3] },
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
                  Provide a centralised gateway for academic events
                </Text>
                <Text size="18px">
                  In 1989, the World Wide Web was created by scientists to facilitate international scientific research communications. 
                  While the original network only consisted in research groups from all around the world, 
                  the many problems it palliated rapidly led to a massive democratisation that completely diluted the former in the mass.
                  We want to offer an easy way to every academics to rapidly and efficiently search and connect with any other research community and their events.
                </Text>
              </Box>

              <Box gridArea="block_2" alignContent="start" margin={{bottom: "20px"}}>
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Give equal chances to any academics to be part of any communities
                </Text>
                <Text size="18px">
                  Research is a social activity. However, some academics can experience difficulties connecting and taking part to their community events if they are hosted far from where they are. 
                  We believe that online streaming technologies can be augmented to palliate to this problem.
                </Text>
              </Box>

              <Box gridArea="block_3" alignContent="start" margin={{bottom: "20px"}}>
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                Facilitate cross-field collaborations
                </Text>
                <Text size="18px">
                  A large class of ground-breaking results arises from the merging of ideas coming from different communities. However, it is not always easy for two different communities to meet and identify common problems 
                  without an active organisational effort allowing them to be physically present at the same place. We hope to facilitate conversations and collaborations by making the organisation of seminars as easy as possible and by providing a central platform where people can easily jump from a seminar to another.
                </Text>
              </Box>

              <Box gridArea="block_1" alignContent="start" margin={{bottom: "20px"}}>
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Contribute into a paradigm shift towards hybrid academic seminars
                </Text>
                <Text size="18px">
                  The COVID-19 crisis created an outburst of ad hoc solutions (e.g. websites hosting excel sheets of talks or nested mailing lists) 
                  to run and advertise the newly online seminars. While the majority of online talks are meant 
                  to disappear as soon as travel restrictions are lifted, we strongly believe that a technological paradigm shift should remain even after the pandemic. 
                  Indeed, online streaming technologies offer the tools to broadcast seminars in every place of the world, democratizing access to world-class research and reducing the carbon footprint associated with scholars' countless travels.
                </Text>
                <Text size="18px">
                  We believe that the future of seminars is going to be a hybrid mixture of in-person and online audience, and we are building our platform around this vision. 
                </Text>
              </Box>
            </Grid>



            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "100px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
              Our values 💛
              </Text>
            </Box>

            <Grid
              rows={
                renderMobileView 
                ?  [
                    "100px", "100px", "100px"
                  ]
                : [
                    "80px", "80px", 
                  ]
              }
              columns={renderMobileView ? ["100%"] : ['50%', "50%"]}
              gap={renderMobileView ? "0px" : "50px"}
              margin={renderMobileView ? {} : {left: "10px"}}
              areas={ renderMobileView 
                ?
                  [
                    { name: 'block_1', start: [0, 0], end: [0, 0] },
                    { name: 'block_2', start: [0, 1], end: [0, 1] },

                    { name: 'block_3', start: [0, 2], end: [0, 2] },
                  ]
                :
                  [
                    { name: 'block_1', start: [0, 0], end: [0, 0] },
                    { name: 'block_2', start: [0, 1], end: [1, 1] },

                    { name: 'block_3', start: [1, 0], end: [1, 0] },
                ]
            }
            >

              <Box gridArea="block_1" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                We are here to make a positive difference in the world of research.
                </Text>
              </Box>

              {/* <Box gridArea="block_2" align="center"> */}
              <Box gridArea="block_2" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                We are bold and build products we believe in.
                </Text>
              </Box>

              <Box gridArea="block_3" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                We thrive for perfection in a small set of tasks over mediocrity in a large set of them.
                </Text>
              </Box>

            </Grid>

            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "50px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Join your forces to ours and be part of the revolution 💪
              </Text>
            </Box>

            <Box gap="small">
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkbox size="25px" />
                  <Text size="25px"> <b>Tell</b> about <img src={agoraStreamFullLogo} style={{ height: "24px", margin: 0 }}/> to all your friends and colleagues </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkbox size="25px" />
                  <Text size="25px"> <b>Organise</b> and share your seminars with <img src={agoraStreamFullLogo} style={{ height: "25px", margin: 0 }}/>  </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkbox size="25px" />
                  <Text size="25px"> <b>Follow</b> us on <a href="https://www.linkedin.com/company/agorastream"><Linkedin/></a> and <a href="https://twitter.com/agorastream"><Twitter/></a> to hear out about next trending seminars and the release of new features</Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Box direction="row" alignContent="start" height="18px">
                    <Checkbox size="25px" /><Box width="10px"></Box>
                    <Text size="25px">  <b>Help us</b> grow faster by </Text><Box width="10px"></Box><DonorButton callback={()=> {}} text={"donating!"}/>
                  </Box>
                </Box>
              </Box>

              <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "100px" : "150px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                About us 👨‍👩‍👧‍👦
              </Text>
            </Box>
            <Box margin={{bottom: "150px"}}>
              <Text size="18px">
                  We are a team of researchers at Imperial College London and the University of Oxford who believes in a connected world where ideas can be exchanged without any friction among inter- and intra-disciplinary communities in an efficient way.
                </Text>
            </Box>
          </Box>

        </Box>






      
    );
  }
}
