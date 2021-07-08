import React, { Component } from "react";
import { Link } from "react-router-dom";
import { User, UserService } from "../Services/UserService";
import { Box, Text, Grid } from "grommet";
import MediaQuery from "react-responsive";
import { Checkmark, Close, Linkedin,  Twitter} from "grommet-icons";
import agoraLogo from "../assets/general/agora_logo_v2.1.png";
import DonorButton from "../Components/Pricing/DonorButton"



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
        <Box width={renderMobileView ? "85%" : "70%"} direction="column" margin={{top: "80px"}}>
          <Box direction="row" gap="small" margin={{bottom: "44px"}}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Our vision
              </Text>
            </Box>
            <Text weight="bold" size="22px">A couple clicks to open the doors of any seminar and connect with any academic communities.</Text>


            <Box direction="row" gap="small" margin={{bottom: "44px", top: (renderMobileView ? "50px" : "100px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
              Our missions
              </Text>
            </Box>


            <Grid
              rows={
                renderMobileView 
                ?  [
                    "300px", "300px", "300px", "300px"
                  ]
                : [
                    "300px", "300px", 
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

              <Box gridArea="block_4" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Connect academic communities
                </Text>
                <Text size="18px">
                  In 1989, the World Wide Web was created by scientists to facilitate international scientific research communications. 
                  While the original network only consisted in research groups from all around the world, 
                  the many problems it palliated rapidly led to a massive democratisation that completely diluted the former in the mass.
                  We want to offer an easy way to every academics to rapidly and efficiently search and connect with any community.
                </Text>
              </Box>

              <Box gridArea="block_2" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Give equal chances to any academics to be part of any communities
                </Text>
                <Text size="18px">
                  Research is a social activity. However, some academics can experience difficulties connecting and taking part to their community events if they are hosted far from where they are. 
                  We believe that online streaming technologies can be augmented to palliate to this problem.
                </Text>
              </Box>

              <Box gridArea="block_3" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                Facilitate cross-field collaborations
                </Text>
                <Text size="18px">
                  A large class of ground-breaking results arises from the merging of ideas coming from different communities. However, it is not always easy for two different communities to meet and identify common problems 
                  without an active organisational effort allowing them to be physically present at the same place. We hope to facilitate conversations and collaborations by making the organisation of seminars as easy as possible and by providing a central platform where people can easily jump from a seminar to another.
                </Text>
              </Box>

              <Box gridArea="block_1" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                  Modernise academic seminars
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
              Our values
              </Text>
            </Box>


            <Grid
              rows={
                renderMobileView 
                ?  [
                    "80px", "80px", "80px"
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

              <Box gridArea="block_2" align="center">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                We build products we believe in.
                </Text>
              </Box>

              <Box gridArea="block_3" alignContent="start">
                <Text size="25px" weight="bold" color="color3" margin={{bottom: "20px"}}>
                We thrive for excellence in a small set of tasks over mediocrity in a large set of them.
                </Text>
              </Box>

            </Grid>




            


            <Box direction="row" gap="small" margin={{bottom: "100px", top: (renderMobileView ? "50px" : "150px") }}>
              <Text size={this.state.sizeHeader} weight="bold" color="color1"> 
                Join your forces to ours!
              </Text>
            </Box>
            <Text>Does our mission and value resonate with you? Then join your forces to us! You can help our vision become a reality by</Text>
            <Box direction="row" gap="10px" margin={{left: "10px", top: "10px", bottom: "100px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Clean and easy-to-use interface for speakers </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> <b> Upload slides </b> to allow participants can go back and forth </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Participants can <b> request the mic </b> and you have the control </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> LateX supported chat </Text>
                </Box>
                <Box direction="row" gap="10px" margin={{left: "10px", top: "10px"}} align="center">
                  <Checkmark size="18px" />
                  <Text> Give a <b> round of applause </b> by pressing your space bar to broadcast a clap </Text>
                </Box>
 
          </Box>

        </Box>






      
    );
  }
}
