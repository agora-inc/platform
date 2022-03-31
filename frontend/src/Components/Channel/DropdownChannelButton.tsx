import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import { Box, Text } from "grommet";
import Identicon from "react-identicons";
import { Channel, ChannelService } from "../../Services/ChannelService";

interface Props {
  channel: Channel;
  isAdmin: boolean;
  onClick: any;
}

interface State {
  hover: boolean;
}

export default class DropdownChannelButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  render() {
          {/* <Link
        to={{
          pathname: `/${this.props.channel.name}/manage`,
          state: { channel: this.props.channel },
        }}
        style={{ height: 40 }}
      > */}
    return ( 
      <Route render={({history}) => ( 
        <Box
          height="40px"
          onClick={() => {
            this.props.onClick();
            history.push( '/' + this.props.channel.name + (this.props.isAdmin ? '/manage' : ''))
          }}
          onMouseEnter={() => {
            this.setState({ hover: true });
          }}
          onMouseLeave={() => {
            this.setState({ hover: false });
          }}
          direction="row"
          gap="small"
          align="start"
          background={this.state.hover ? "#f2f2f2" : "color6"}
          round="xsmall"
          pad="xsmall"
          justify="start"
          focusIndicator={false}
        >
          {/*style={{ border: "black 2px solid" }}*/}
          <Box
            height="30px"
            width="30px"
            round="15px"
            justify="center"
            align="start"
            overflow="hidden"
          >
            {!this.props.channel.has_avatar && (
              <Identicon string={this.props.channel.name} size={30} />
            )}
            {this.props.channel.has_avatar && (
              <img
                src={ChannelService.getAvatar(this.props.channel.id)}
                width={20}
                height={20}
              />
            )}
          </Box>
          <Text
            alignSelf="center"
            size="14px"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {this.props.channel.name}
          </Text>

        </Box>
      )} /> 
    );
  }
}
