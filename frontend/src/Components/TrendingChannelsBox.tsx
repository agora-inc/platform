import React, { Component } from "react";
import { Box, Text } from "grommet";
import Identicon from "react-identicons";
import "../Styles/trending-channels-box.css";

interface Props {
  gridArea: string;
}

interface State {
  channels: string[];
}

export default class TrendingChannelsBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      channels: [],
    };
  }

  componentWillMount() {
    const channels = [
      "ImperialBioEng",
      "ImperialEEE",
      "ImperialMaths",
      "DoCSoc",
      "Google Brain",
      "Neuralink",
      "ImperialDesEng",
      "RenTec",
      "Microsoft Research",
      "PolyAI",
      "DeepMind",
      "ImperialPhysics",
      "OxfordMaths",
      "CambridgeMaths",
      "Y Combinator",
      "Facebook Research",
    ];
    this.setState({ channels });
  }

  render() {
    return (
      <Box
        pad={{ horizontal: "40px", vertical: "20px" }}
        width="100%"
        height="100%"
        round="15px"
        className="trending-channels-box"
        gridArea={this.props.gridArea}
      >
        <Text size="32px" weight="bold" color="black">
          Trending channels
        </Text>
        <Box direction="row" wrap justify="between" margin={{ top: "20px" }}>
          {this.state.channels.map((channel: string) => (
            <Box
              background="white"
              height="64px"
              width="64px"
              round="32px"
              justify="center"
              align="center"
              margin={{ bottom: "20px" }}
            >
              <Identicon string={channel} size={36} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
}
