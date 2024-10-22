import React, { Component } from "react";
import { Box, Text, Table, TableHeader, TableRow, TableCell, TableBody } from "grommet";
import { Close, Checkmark, FormNextLink } from "grommet-icons";
import Switch from "../Components/Core/Switch";
import moraStreamFullLettersLogo from "../assets/general/mora.stream_logo_v2.1.png";
import { User, UserService } from "../Services/UserService";
import { StreamingProductService, StreamingProduct } from "../Services/StreamingProductService";
import { ChannelSubscriptionService } from "../Services/ChannelSubscriptionService";
import { CancelSubscriptionsButton } from "../Components/Channel/ChannelSubscriptionsButtons/CancelSubscriptionsButton";
import { CheckoutPaymentButton } from "../Components/Channel/ChannelSubscriptionsButtons/CheckoutPaymentButton";


interface Props {
  headerTitle: boolean
  channelId: number | null
  userId: number | null
  disabled: boolean
  showDemo: boolean
  callback: any
  title?: string
}
interface State {
  pricingOptionBig: boolean;
  pricingOptionMonthly: boolean;
  allStreamingProducts: StreamingProduct[];
  allPlansId: number[];
}


export default class ManageChannelPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pricingOptionBig: false,
      pricingOptionMonthly: true,
      allStreamingProducts: [],
      allPlansId: [],
    }
  }

  componentDidMount() {
    this.getAllStreamingProducts()
    this.getChannelSubscriptions()
  }
  
  getAllStreamingProducts = () => {
    StreamingProductService.getAllStreamingProducts(
      (allStreamingProducts: StreamingProduct[]) => {
        this.setState({ allStreamingProducts })
      }
    )
  }

  getChannelSubscriptions = () => {
    if (this.props.channelId) {
      ChannelSubscriptionService.getAllActiveSubscriptionsForChannel(
        this.props.channelId, 
        (allPlansId: number[]) => {
          this.setState({ allPlansId })
        }
      );
    } else {
      this.setState({ allPlansId: [] })
    }
  }

  getPrice = (tier: "tier1" | "tier2", audienceSize: "small" | "big") => {
    let p = this.state.allStreamingProducts.filter(
      function (product: StreamingProduct) {
        return product.tier == tier && product.audience_size === audienceSize
      }
    )
    if (p.length > 0) {
      return p[0].price_in_dollars
    } else {
      return "x";
    }
  }

  getProductId = (tier: "tier1" | "tier2", audienceSize: "small" | "big") => {
    let p = this.state.allStreamingProducts.filter(
      function (product: StreamingProduct) {
        return product.tier == tier && product.audience_size === audienceSize
      }
    )
    if (p.length > 0) {
      return p[0].id
    } else {
      return -1;
    }
  }

  isSubscribedTo = (tier: "tier1" | "tier2", audienceSize: "small" | "big") => {
    let p = this.state.allStreamingProducts.filter(
      function (product: StreamingProduct) {
        return product.tier == tier && product.audience_size === audienceSize
      }
    )
    if (p.length > 0) {
      return this.state.allPlansId.includes(p[0].id)
    } else {
      return false;
    }
  }

  showProduct = (id: number) => {
    let list = this.state.allStreamingProducts.filter( 
      function (p: StreamingProduct) {
        return p.id === id 
      })
    
    if (list.length > 0) {
      let planName = list[0].tier === "tier1" 
        ? "Full automation" 
        : (list[0].tier === "tier2" ? "Excellence" : list[0].tier)
      return planName + " plan with " + list[0].audience_size + " audience ($" + list[0].price_in_dollars + " / month)";  
    } else {
      return "";
    }
      
  }

  render() {
    let audienceSize: "small" | "big" = this.state.pricingOptionBig ? "big" : "small";
    let title = this.props.title ? this.props.title : "Empower your community now!"

    return (
      <Box align="start" width="100%" style={{ overflowY: "auto" }}>

        {!this.props.headerTitle && (
          <Box
            justify="start"
            width="99.7%"
            background="#eaf1f1"
            direction="row"
            margin={{ bottom: "20px" }}
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
              <Text size="16px" color="black" weight="bold" margin={{ left: "10px" }} >
                {title}
            </Text>
            </Box>
            <Box pad="32px" alignSelf="center">
              <Close onClick={this.props.callback} />
            </Box>
          </Box>
        )}
        {this.props.headerTitle && (
          <Box align="start" margin={{ bottom: "40px" }} >
            <Text size="32px" weight="bold" color="color1">
              {title}
          </Text>
          </Box>
        )}

        <Box width="95%" margin={{ left: "2%" }} >

          {!this.props.disabled && this.state.allPlansId.length > 0 && (
            <Box margin={{ bottom: "20px", left: "10px" }} direction="row">
              <Text size="14px" weight="bold" >
                Your current subscription:
              </Text> 
              
              {this.state.allPlansId.map( (productId: number) => {
                return (
                  <Text size="14px" weight="bold" color="#6DA3C7" margin={{ left: "10px" }} > 
                    {this.showProduct(productId)}
                  </Text>
                );
              })}
            </Box>
          )}
          {!this.props.disabled && this.state.allPlansId.length === 0 && (
            <Box margin={{ bottom: "20px", left: "10px" }}>
              <Text size="18px" weight="bold" >
                You are currently on our free plan.
              </Text>
              <Text size="18px" margin={{top:"20px"}} >
                To democratise access to knowledge, we offer most of the above features <b>for free</b>! For the premium ones, check out the pricing below!
              </Text>
            </Box>
          )}  

          <Box direction="row" gap="10px" align="center" margin={{ top:"20px", bottom: "20px", left: "10px" }}>
            <Text size="14px" style={{ fontStyle: "italic" }} >
              Do you have more than 30 people attending your seminars?
          </Text>
          <Switch
            height={25}
            width={(window.innerWidth > 800) ? 60 : 100}
            checked={false}
            callback={(pricingOptionBig: boolean) => {this.setState({ pricingOptionBig })}}
            textOn="Yes"
            textOff="No" 
          />
            {/* checked={this.state.pricingOptionBig}
            checkedChildren="Big" 
            unCheckedChildren="Small"
            onChange={(checked: boolean) => {
              this.setState({ pricingOptionBig: checked });
            }}
          size="default" */}
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

          <Table margin={{bottom: "20px"}}>
            <TableHeader>
              <TableRow>
                <TableCell scope="col" border="bottom">
                </TableCell>

                <TableCell scope="col" border="bottom" width="120px">
                  <Text size="14px" weight="bold"> Free </Text>
                </TableCell>

                <TableCell scope="col" border="bottom" width="170px">
                  <Text size="14px" weight="bold"> Automation </Text>
                </TableCell>

                <TableCell scope="col" border="bottom" width="150px">
                  <Text size="14px" weight="bold"> Hybrid </Text>
                </TableCell>

                {this.props.showDemo && <TableCell scope="col" border={{ size: "0px" }} width="60px" />}

              </TableRow>
            </TableHeader>

            <TableBody style={{ marginTop: "50px" }} >

              <TableRow style={{ alignSelf: "center" }}>
                <TableCell scope="row">
                  <Text weight="bold" size="14px"> Automatized registration </Text>
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell scope="row">
                  <Text weight="bold" size="14px"> Posting on social media </Text>
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell scope="row">
                  <Text weight="bold" size="14px"> Email reminders </Text>
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell scope="row">
                  <Text weight="bold" size="14px"> Virtual cafeteria </Text>
                </TableCell>
                <TableCell scope="row">
                <Text size="14px"> Public</Text>
                </TableCell>
                <TableCell scope="row">
                  <Text size="14px"> Public or Private</Text>
                </TableCell>
                <TableCell scope="row">
                <Text size="14px"> Public or Private</Text>
                </TableCell>
            </TableRow>


              <TableRow>
                <TableCell scope="row">
                  <Text weight="bold" size="14px"> Streaming tech </Text>
                </TableCell>
                <TableCell scope="row">
                  Your own
                </TableCell>
                <TableCell scope="row">
                  Your own or <img src={moraStreamFullLettersLogo} style={{ height: "14px", marginTop: "1px"}}/>
                </TableCell>
                <TableCell scope="row">
                  Your own or <img src={moraStreamFullLettersLogo} style={{ height: "14px", marginTop: "1px"}}/>
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
                      onClick={() => { }}
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
                  <Close size="25px" color="red" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Close size="25px" color="red" style={{ alignSelf: "center" }} />
                </TableCell>
                <TableCell scope="row">
                  <Checkmark size="25px" color="green" style={{ alignSelf: "center" }} />
                </TableCell>
              </TableRow>


            {/* <TableRow>
              <TableCell scope="row">
                <Text weight="bold" size="14px"> Mobile app (coming soon!) </Text>
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
            </TableRow> */}

                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell margin={{ top: "20px" }}>
                    {this.props.disabled && (
                      <Box
                        onClick={() => {}}
                        background="#CCCCCC"
                        round="xsmall"
                        pad="xsmall"
                        width="160px"
                        height="40px"
                        justify="center"
                        align="center"
                        focusIndicator={false}
                        hoverIndicator={false}
                      >
                        <Text size="14px" weight="bold">
                          $ {this.getPrice("tier1", audienceSize)} / month
                        </Text>
                      </Box>
                    )}
                    {!this.props.disabled && this.props.channelId && this.props.userId && 
                      this.isSubscribedTo("tier1", audienceSize) && (
                        <CancelSubscriptionsButton channelId={this.props.channelId} />
                    )}
                    {!this.props.disabled && this.props.channelId && this.props.userId && 
                      !this.isSubscribedTo("tier1", audienceSize) && (
                        <CheckoutPaymentButton
                          userId={this.props.userId}
                          productId={this.getProductId("tier1", audienceSize)}
                          quantity={1}
                          channelId={this.props.channelId}
                          text={"$ " + this.getPrice("tier1", audienceSize) + " / month"}
                        />
                    )}

                  </TableCell>

                  <TableCell margin={{ top: "20px" }}>
                    {this.props.disabled && (
                        <Box
                          onClick={() => {}}
                          background="#CCCCCC"
                          round="xsmall"
                          pad="xsmall"
                          width="160px"
                          height="40px"
                          justify="center"
                          align="center"
                          focusIndicator={false}
                          hoverIndicator={false}
                        >
                          <Text size="14px" weight="bold">
                            $ {this.getPrice("tier2", audienceSize)} / month
                          </Text>
                        </Box>
                      )}
                      {!this.props.disabled && this.props.channelId && this.props.userId && 
                        this.isSubscribedTo("tier2", audienceSize) && (
                          <CancelSubscriptionsButton channelId={this.props.channelId} />
                      )}
                      {!this.props.disabled && this.props.channelId && this.props.userId && 
                        !this.isSubscribedTo("tier2", audienceSize) && (
                          <CheckoutPaymentButton
                            userId={this.props.userId}
                            productId={this.getProductId("tier2", audienceSize)}
                            quantity={1}
                            channelId={this.props.channelId}
                            text={"$ " + this.getPrice("tier2", audienceSize) + " / month"}
                          />
                      )}
                  </TableCell>
                </TableRow>

            </TableBody>
          </Table>
        </Box>
      </Box>
    )
  }
}