import React, { Component } from "react";
import { Box, Grid, Text, Layer, Button, Heading } from "grommet";
import {Howl, Howler} from "howler";


interface Props {
  [label: string]: any
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

    soundPlay = (tag: string, vol: number) => {
      const sound = new Howl({
        src: this.props[tag], 
        volume: vol,
        sprite: {
          cut: [0, 8000],
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
      this.soundPlay("clapBase", 0.2);
      this.soundPlay("clapUser", 0.0);
      console.log(this.state)
      document.addEventListener('keypress', this.onPress);
      



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
  

/*
  <div>
  <button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button>
</div>
*/