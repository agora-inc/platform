import React, { Component } from "react";
import { Box, Grid, Text, Layer, Button } from "grommet";


interface Props {
    pathname: string
}

interface State {
    play: boolean
    overlay: boolean
    audio: any
}
  
export default class AudioPlayer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            play: false,
            overlay: false,
            audio: null
        };
    }
    
    componentDidMount() {
        console.log(this.state.audio);
        this.setState({ audio: new Audio(this.props.pathname)}); // 
        console.log(this.state.audio);
        this.state.audio.addEventListener('ended', () => this.setState({ play: false }));
    }
  
    componentWillUnmount() {
        this.state.audio.removeEventListener('ended', () => this.setState({ play: false }));  
    }
  
    togglePlay = () => {
        if (!this.state.play) {
            this.setState({ play: !this.state.play });
            var playPromise = this.state.audio.play();
            if (playPromise !== null){
                playPromise.catch(() => { this.state.audio.play(); })
            }
            console.log(playPromise);
        }
    }
  
    render() {
      return (
        <Button label="close" onClick={() => this.setState({overlay: false})} />
      );
    }
  }
  

/*
  <div>
  <button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button>
</div>
*/