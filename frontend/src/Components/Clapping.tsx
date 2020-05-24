import React, { Component } from "react";
import { Box, Grid, Text, Layer, Button, Heading } from "grommet";
import {Howl, Howler} from "howler";


interface Props {
  [label: string]: any;
}

interface State {
  play: boolean
  overlay: boolean
  sounds: {[label: string]: Howl}
}

export default class Clapping extends Component<Props, State> {  
  constructor(props: Props) {
    super(props);
    this.state = {
      play: false,
      overlay: false,
      sounds: {}
    };
  }

  static defaultProps = {
    totalTimeClap: 10000.0,
    totalTimeOverlay: 7000.0,
    updateFrequency: 200.0,
    startVolume: 0.2,
  }

  soundPlay = (tag: string, vol: number) => {
    const sound = new Howl({
      src: this.props[tag], 
      volume: vol,
      sprite: {
        cut: [0, this.props.totalTimeClap],
      }
    });

    this.state.sounds[tag] = sound;
    this.state.sounds[tag].play('cut');
  }

  /*
  componentDidMount() {
    this.props.audio.addEventListener('ended', () => this.setState({ play: false }));
  }
  
  componentWillUnmount() {
    this.state.audio.removeEventListener('ended', () => this.setState({ play: false }));  
  }
  */

  onPress = (event: any) => {
    if (event.keyCode == 0 || event.keyCode == 32) {
      // Setting volume level
      this.state.sounds.clapUser.volume(Math.min(this.state.sounds.clapUser.volume() + 0.05, 1.0));
    }
  }

  startClapping = () => {
    this.setState({overlay: true}); 
    if (!this.state.play) {
      this.setState({ play: !this.state.play });
    }
    this.soundPlay("clapBase", this.props.startVolume);
    this.soundPlay("clapUser", 0.0);
    console.log(this.state)
    console.log(this.props)
    document.addEventListener('keypress', this.onPress);
    var nUpdates = this.props.totalTimeClap / this.props.updateFrequency;
    var countUpdates = 0;
    var ratio = 0;
    var intervalID = window.setInterval(
      () => {
        countUpdates += 1;
        if (countUpdates > nUpdates) {
          this.state.sounds.clapBase.volume(0.0);
          this.state.sounds.clapBase.volume(0.0);
          clearInterval(intervalID);
          return; 
        }
        if (countUpdates >= this.props.totalTimeOverlay / this.props.totalTimeClap*nUpdates) {
          this.setState({overlay: false})
        }
    
        ratio = countUpdates / nUpdates
        this.state.sounds.clapBase.volume(
          Math.max(0.0, Math.min(1.0, 4*(1-ratio)*(ratio + this.props.startVolume/4) + 0.5 *  Math.sqrt(ratio * (1-ratio)) * (Math.random()-0.5)))
        );
        this.state.sounds.clapUser.volume(
          Math.max(this.state.sounds.clapUser.volume() - 0.03, 0.0)
        );
        console.log("Volume base: " + this.state.sounds.clapBase.volume());
        console.log("Volume user: " + this.state.sounds.clapUser.volume());
      }, 
      this.props.updateFrequency
    );
  }
  
  render() {
    return (
      <Box>
        <Button label="Let's thank the speaker" onClick={() => this.startClapping()} />
          {this.state.overlay && (
            <Layer               
              modal={true}
              position='center'
            >
              <Heading level={2} margin={{"top": "100px", "bottom": "100px", "left": "100px", "right": "100px"}} >
                Press the space bar to clap
              </Heading>
            </Layer>
          )}
      </Box>
    );
  }
}
