import React, { Component } from "react";
import { Box, Text, Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
import { Close, Checkmark, FormNextLink } from "grommet-icons";
import { Switch } from "antd";
import agoraLogo from "../assets/general/agora_logo_v2.1.png";


interface Props {
  headerTitle: boolean
  showDemo: boolean
  callback: any;
}
interface State {
  pricingOptionBig: boolean;
  pricingOptionMonthly: boolean;
}


export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pricingOptionBig: false,
      pricingOptionMonthly: true,
    }
  }

  render() {
    let monthlyPrices = [12, 20, 45, 60]
    return (
      <Box align="start" width="100%" style={{ overflowY: "auto" }}>

      {!this.props.headerTitle && (
        <Box
          justify="start"
          width="99.7%"
          background="#eaf1f1"
          direction="row"
          margin={{bottom: "20px"}}
          style={{
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            position: "sticky",
            top: 0,
            height: "60px",
            zIndex: 10,
          }}
        >
          <Box alignSelf="center" fill={true} pad="20px" >
            <Text size="16px" color="black" weight="bold" >
              Empower your research group!
            </Text>
          </Box>
          <Box pad="32px" alignSelf="center">
            <Close onClick={this.props.callback} />
          </Box>
        </Box>
      )}
      {this.props.headerTitle && (
        <Box align="start" margin={{bottom: "40px"}} >
          <Text size="32px" weight="bold" color="color1"> 
            Empower your research group!
          </Text>
        </Box>
      )}

      <Box width="95%" margin={{left: "0px"}} > 

        <Box direction="row" gap="10px" align="center" margin={{bottom: "20px", left: "10px"}}> 
          <Text size="14px" style={{fontStyle: "italic"}} > 
            Select "Big" if you have an audience of more than 30 people:
          </Text>
          <Switch
            checked={this.state.pricingOptionBig}
            checkedChildren="Big" 
            unCheckedChildren="Small"
            onChange={(checked: boolean) => {
              this.setState({ pricingOptionBig: checked });
            }}
            size="default"
          /> 
        </Box>

        {/*<Box direction="row" gap="10px" align="center" margin={{bottom: "30px"}}> 
          <Text size="14px" style={{fontStyle: "italic"}}> 
            Select the plan frequency:
          </Text>
          <Switch
            checked={this.state.pricingOptionMonthly}
            checkedChildren="per month" 
            unCheckedChildren="per event"
            onChange={(checked: boolean) => {
              this.setState({ pricingOptionMonthly: checked });
            }}
            size="default"
          /> 
          </Box> */}

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col" border="bottom">
              </TableCell>

              <TableCell scope="col" border="bottom" width="120px">
                <Text size="14px" weight="bold"> Free </Text>  
              </TableCell>

              <TableCell scope="col" border="bottom" width="170px">
                <Text size="14px" weight="bold"> Full automation </Text>
              </TableCell>

              <TableCell scope="col" border="bottom" width="150px">
                <Text size="14px" weight="bold"> Excellence </Text>
              </TableCell>

              {this.props.showDemo && <TableCell scope="col" border={{size: "0px"}} width="60px" />}

            </TableRow>
          </TableHeader>

          <TableBody style={{marginTop: "50px"}} >

            <TableRow style={{alignSelf: "center"}}>
              <TableCell scope="row">
                <Text weight="bold" size="14px"> Automatized regstration </Text>
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">
                <Text weight="bold" size="14px"> Posting on social media </Text>
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">
                <Text weight="bold" size="14px"> Email reminders </Text>
              </TableCell>
              <TableCell scope="row">
                <Text size="14px"> 100 emails / month </Text> 
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">
                <Text weight="bold" size="14px"> <img src={agoraLogo} style={{ height: "14px", marginTop: "1px", marginRight: "-1px"}} /> streaming tech </Text>
              </TableCell>
              <TableCell scope="row">
                <Close size="25px" color="red" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Close size="25px" color="red" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
              {this.props.showDemo && (
                <TableCell scope="row">
                  <Box
                    direction="row"
                    justify="center"
                    align="center"
                    pad="small"
                    focusIndicator={false}
                    height="30px"
                    background="#EAF1F1"
                    hoverIndicator="#BAD6DB"
                    round="small"
                    onClick={()=>{}}
                  >
                    <FormNextLink size="25px" color="black" />
                    <Text weight="bold" color="black" size="14px">
                      Watch demo
                    </Text>
                  </Box>
                </TableCell>
              )}
            </TableRow>

            <TableRow>
              <TableCell direction="column" scope="row">
                <Text weight="bold" size="14px"> Automatic upload </Text> 
                <Text weight="bold" size="14px"> slides + recording </Text>
              </TableCell>
              <TableCell scope="row">
                <Close size="25px" color="red" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Close size="25px" color="red" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell scope="row">
                <Text weight="bold" size="14px"> Virtual cafeteria </Text>
              </TableCell>
              <TableCell scope="row">
                <Close size="25px" color="red" style={{alignSelf: "center"}} />
              </TableCell>
              <TableCell scope="row">
                <Text size="14px"> For 2 seminars / month </Text>
              </TableCell>
              <TableCell scope="row">
                <Checkmark size="25px" color="green" style={{alignSelf: "center"}} />
              </TableCell>
              {this.props.showDemo && (
                <TableCell scope="row">
                  <Box
                    direction="row"
                    justify="center"
                    align="center"
                    pad="small"
                    focusIndicator={false}
                    height="30px"
                    background="#EAF1F1"
                    hoverIndicator="#BAD6DB"
                    round="small"
                    onClick={()=>{}}
                  >
                    <FormNextLink size="25px" color="black" />
                    <Text weight="bold" color="black" size="14px">
                      Watch demo
                    </Text>
                  </Box>
                </TableCell>
              )}
            </TableRow>

            <TableRow>
              <TableCell/>
              <TableCell/>
              <TableCell margin={{top: "20px"}}>  
                <Box
                  onClick={this.props.callback}
                  background="#0C385B"
                  round="xsmall"
                  pad="xsmall"
                  width="160px"
                  height="40px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator="#6DA3C7"
                >
                  <Text size="14px" weight="bold"> £{monthlyPrices[+this.state.pricingOptionBig]} / month  </Text>
                </Box>
              </TableCell>
              <TableCell margin={{top: "20px"}}>                                
                <Box
                  onClick={this.props.callback}
                  background="#0C385B"
                  round="xsmall"
                  pad="xsmall"
                  width="160px"
                  height="40px"
                  justify="center"
                  align="center"
                  focusIndicator={false}
                  hoverIndicator="#6DA3C7"
                >
                  <Text size="14px" weight="bold"> £{monthlyPrices[+this.state.pricingOptionBig+2]} / month  </Text>
                </Box> 
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </Box>
    </Box>
  )}
}