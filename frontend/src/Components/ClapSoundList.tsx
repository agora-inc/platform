import React, { Component } from "react";
import { Box, Grid, Text, Layer, Button, List, Heading } from "grommet";
import { Howl, Howler } from "howler";
import { DownSquareFilled } from "@ant-design/icons";


export default class ClapSoundList extends Component {  
  constructor(props: Props) {
    super(props);
  }

  claps = {
    "clapBase": require("../assets/auditorium.mp3"),
    "clapUser": require("../assets/applause-7.mp3")
  };

  toHowl(path: string): Howl  {
    return new Howl({
      src: path, 
      volume: 0.5,
    });
  }

  render() {
    return(
      <Box direction="row" margin={{left: "xlarge", top:"xlarge"}} >
      <Heading level={3} margin={{right: "large"}}>
        Clapping sounds
      </Heading>
      <List
        primaryKey="name"
        secondaryKey="percent"
        alignSelf="start"
        data={[
          { name: 'Auditorium', play: <PlayButton sound={this.toHowl(this.claps.clapUser)}/> },
          { name: 'Base', percent: <PlayButton sound={this.toHowl(this.claps.clapBase)} />},
        ]}
      />
      </Box>
    );
  }
}



interface Props {
  sound: Howl
}

interface State {
  play: boolean
}

class PlayButton extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      play: false
    };
  }
  render() {
    return (
      <Button
        onClick={() => {
          this.state.play ? this.props.sound.pause() : this.props.sound.play();
          this.setState({play: !this.state.play});
        }}
        alignSelf="center"
        style={{
          width: 80,
          height: 40,
          fontSize: 18,
          fontWeight: "bold",
          padding: 10,
          margin: 6,
          backgroundColor: "#61EC9F",
          border: "none",
          borderRadius: 10,
        }}
      > Play it! </Button>
    );
  }
}