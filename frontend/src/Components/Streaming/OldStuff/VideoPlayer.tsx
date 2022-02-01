import React, { Component } from "react";
import videojs, { VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import "@videojs/http-streaming/dist/videojs-http-streaming.min.js";

interface Props {
  style: any;
  playerOptions: VideoJsPlayerOptions;
}

export default class VideoPlayer extends Component<Props> {
  private player: any;
  private videoNode: any;
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(
      this.videoNode,
      this.props.playerOptions,
      function onPlayerReady() {
        console.log("onPlayerReady");
      }
    );
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div style={this.props.style}>
        <div data-vjs-player style={{ height: "100%", width: "100%" }}>
          <video
            data-setup='{"liveui": true}'
            ref={(node) => (this.videoNode = node)}
            className="video-js"
          ></video>
        </div>
      </div>
    );
  }
}
