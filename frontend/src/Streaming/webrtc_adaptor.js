/**
 *
 * @returns
 */

"use strict";

import adapter from "webrtc-adapter";

export function WebRTCAdaptor(initialValues) {
  class PeerStats {
    constructor(streamId) {
      this.streamId = streamId;
      this.totalBytesReceivedCount = 0;
      this.totalBytesSent = 0;
      this.packetsLost = 0;
      this.fractionLost = 0;
      this.startTime = 0;
      this.lastBytesReceived = 0;
      this.lastBytesSent = 0;
      this.currentTimestamp = 0;
      this.lastTime = 0;
      this.timerId = 0;
      this.firstByteSentCount = 0;
      this.firstBytesReceivedCount = 0;
    }

    //kbits/sec
    get averageOutgoingBitrate() {
      return Math.floor(
        (8 * (this.totalBytesSentCount - this.firstByteSentCount)) /
          (this.currentTimestamp - this.startTime)
      );
    }

    //kbits/sec
    get averageIncomingBitrate() {
      return Math.floor(
        (8 * (this.totalBytesReceivedCount - this.firstBytesReceivedCount)) /
          (this.currentTimestamp - this.startTime)
      );
    }

    //kbits/sec
    get currentOutgoingBitrate() {
      return Math.floor(
        (8 * (this.totalBytesSentCount - this.lastBytesSent)) /
          (this.currentTimestamp - this.lastTime)
      );
    }

    //kbits/sec
    get currentIncomingBitrate() {
      return Math.floor(
        (8 * (this.totalBytesReceivedCount - this.lastBytesReceived)) /
          (this.currentTimestamp - this.lastTime)
      );
    }

    set currentTime(timestamp) {
      this.lastTime = this.currentTimestamp;
      this.currentTimestamp = timestamp;
      if (this.startTime == 0) {
        this.startTime = timestamp - 1; // do not have zero division error
      }
    }

    set totalBytesReceived(bytesReceived) {
      this.lastBytesReceived = this.totalBytesReceivedCount;
      this.totalBytesReceivedCount = bytesReceived;
      if (this.firstBytesReceivedCount == 0) {
        this.firstBytesReceivedCount = bytesReceived;
      }
    }

    set totalBytesSent(bytesSent) {
      this.lastBytesSent = this.totalBytesSentCount;
      this.totalBytesSentCount = bytesSent;
      if (this.firstByteSentCount == 0) {
        this.firstByteSentCount = bytesSent;
      }
    }
  }

  // thiz refers to the context of the whole function WebRTCAdaptor
  var thiz = this;
  thiz.peerconnection_config = null;
  thiz.sdp_constraints = null;
  thiz.remotePeerConnection = new Array();
  thiz.remotePeerConnectionStats = new Array();
  thiz.remoteDescriptionSet = new Array();
  thiz.iceCandidateList = new Array();
  thiz.webSocketAdaptor = null;
  thiz.roomName = null;
  thiz.videoTrackSender = null;
  thiz.audioTrackSender = null;
  thiz.playStreamId = new Array();
  thiz.micGainNode = null;
  thiz.localStream = null;
  thiz.bandwidth = 900; //default bandwidth kbps

  thiz.isPlayMode = false;
  thiz.debug = false;

  /**
   * The cam_location below is effective when camera and screen is send at the same time.
   * possible values are top and bottom. It's on right all the time
   */
  thiz.camera_location = "top";

  /**
   * The cam_margin below is effective when camera and screen is send at the same time.
   * This is the margin value in px from the edges
   */

  thiz.camera_margin = 15;

  /**
   * Thiz camera_percent is how large the camera view appear on the screen. It's %15 by default.
   */
  thiz.camera_percent = 15;

  for (var key in initialValues) {
    if (initialValues.hasOwnProperty(key)) {
      this[key] = initialValues[key];
    }
  }

  thiz.localVideo = document.getElementById(thiz.localVideoId);
  thiz.remoteVideo = document.getElementById(thiz.remoteVideoId);

  if (!("WebSocket" in window)) {
    console.log("WebSocket not supported.");
    thiz.callbackError("WebSocketNotSupported");
    return;
  }

  if (
    typeof navigator.mediaDevices == "undefined" &&
    thiz.isPlayMode == false
  ) {
    console.log(
      "Cannot open camera and mic because of unsecure context. Please Install SSL(https)"
    );
    thiz.callbackError("UnsecureContext");
    return;
  }

  /**
   * Get user media
   */
  this.getUserMedia = function (mediaConstraints, audioConstraint) {
    // self refers to the context of this function only
    const self = this;
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(function (stream) {
        //this trick, getting audio and video separately, make us add or remove tracks on the fly
        var audioTrack = stream.getAudioTracks();
        if (audioTrack.length > 0) {
          stream.removeTrack(audioTrack[0]);
        }

        // add callback on closing after desktop finished sharing
        if (
          mediaConstraints.video != "undefined" &&
          typeof mediaConstraints.video.mandatory != "undefined" &&
          typeof mediaConstraints.video.mandatory.chromeMediaSource !=
            "undefined" &&
          mediaConstraints.video.mandatory.chromeMediaSource == "desktop"
        ) {
          stream.getVideoTracks()[0].onended = function (event) {
            thiz.callback("screen_share_stopped");
          };
        }

        // now get only audio to add this stream
        if (audioConstraint != "undefined" && audioConstraint != false) {
          var media_audio_constraint = { audio: audioConstraint };
          navigator.mediaDevices
            .getUserMedia(media_audio_constraint)
            .then(function (audioStream) {
              if (
                thiz.mediaConstraints != "undefined" &&
                thiz.mediaConstraints.video == "screen+camera"
              ) {
                navigator.mediaDevices
                  .getUserMedia({ video: true, audio: false })
                  .then(function (cameraStream) {
                    //create a canvas element
                    var canvas = document.createElement("canvas");
                    var canvasContext = canvas.getContext("2d");

                    //create video element for screen
                    //var screenVideo = document.getElementById('sourceVideo');
                    var screenVideo = document.createElement("video");
                    //TODO: check audio track
                    screenVideo.srcObject = stream;
                    screenVideo.play();

                    //create video element for camera
                    var cameraVideo = document.createElement("video");
                    //TODO: check audio track
                    cameraVideo.srcObject = cameraStream;
                    cameraVideo.play();

                    var canvasStream = canvas.captureStream(15);
                    canvasStream.addTrack(audioStream.getAudioTracks()[0]);
                    //call gotStream
                    this.gotStream(canvasStream);  // I have no idea what this line does. If you understand, please tell REMY!!

                    //update the canvas
                    setInterval(function () {
                      //draw screen to canvas
                      canvas.width = screenVideo.videoWidth;
                      canvas.height = screenVideo.videoHeight;
                      canvasContext.drawImage(
                        screenVideo,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                      );

                      var cameraWidth =
                        screenVideo.videoWidth * (thiz.camera_percent / 100);
                      var cameraHeight =
                        (cameraVideo.videoHeight / cameraVideo.videoWidth) *
                        cameraWidth;

                      var positionX =
                        canvas.width - cameraWidth - thiz.camera_margin;
                      var positionY;

                      if (thiz.camera_location == "top") {
                        positionY = thiz.camera_margin;
                      } else {
                        //if not top, make it bottom
                        //draw camera on right bottom corner
                        positionY =
                          canvas.height - cameraHeight - thiz.camera_margin;
                      }

                      canvasContext.drawImage(
                        cameraVideo,
                        positionX,
                        positionY,
                        cameraWidth,
                        cameraHeight
                      );
                    }, 66);
                  })
                  .catch(function (error) {
                    thiz.callbackError(error.name, error.message);
                  });
              } else {
                stream.addTrack(audioStream.getAudioTracks()[0]);
                self.gotStream(stream);
              }
            })
            .catch(function (error) {
              thiz.callbackError(error.name, error.message);
            });
        } else {
          stream.addTrack(stream.getAudioTracks()[0]);
          self.gotStream(stream); // I have no idea what this line does. If you understand, please tell REMY!!
        }
      })
      .catch(function (error) {
        thiz.callbackError(error.name, error.message);
      });
  };

  // function creating the stream of the screen-sharing
  this.openScreen = function (audioConstraint, openCamera) {
    var callback = function (message) {
      if (message.data == "rtcmulticonnection-extension-loaded") {
        console.debug(
          "rtcmulticonnection-extension-loaded parameter is received"
        );
        window.postMessage("get-sourceId", "*");
      } else if (message.data == "PermissionDeniedError") {
        console.debug("Permission denied error");
        thiz.callbackError("screen_share_permission_denied");
      } else if (message.data && message.data.sourceId) {
        var mediaConstraints = {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: message.data.sourceId,
            },
            optional: [],
          },
        };

        thiz.getUserMedia(mediaConstraints, audioConstraint);

        //remove event listener
        window.removeEventListener("message", callback);
      }
    };
    window.addEventListener("message", callback, false);

    window.postMessage("are-you-there", "*");
  };

  /**
   * Open media stream (it may be "screen" or "screen+webcam" depending on browser)
   */
  this.openStream = function (mediaConstraints) {
    thiz.mediaConstraints = mediaConstraints;
    var audioConstraint = false;
    if (
      typeof mediaConstraints.audio != "undefined" &&
      mediaConstraints.audio != false
    ) {
      audioConstraint = mediaConstraints.audio;
    }

    if (typeof mediaConstraints.video != "undefined") {
      if (
        mediaConstraints.video == "screen+camera" ||
        mediaConstraints.video == "screen"
      ) {
        this.openScreen(audioConstraint);
      } else {
        thiz.getUserMedia(mediaConstraints, audioConstraint);
      }
    } else {
      console.error("MediaConstraint video is not defined");
      thiz.callbackError("media_constraint_video_not_defined");
    }
  };

  /**
   * Closes stream, if you want to stop peer connection, call stop(streamId)
   */
  this.closeStream = function () {
    thiz.localStream.getVideoTracks().forEach(function (track) {
      console.log("VIDEO TRACK:", track);
      track.onended = null;
      track.stop();
    });

    thiz.localStream.getAudioTracks().forEach(function (track) {
      console.log("AUDIO TRACK:", track);
      track.onended = null;
      track.stop();
    });
  };

  /**
   * Checks chrome screen share extension is avaiable
   * if exists it call callback with "screen_share_extension_available"
   */
  this.checkExtension = function () {
    var callback = function (message) {
      if (message.data == "rtcmulticonnection-extension-loaded") {
        thiz.callback("screen_share_extension_available");
        window.removeEventListener("message", callback);
      }
    };
    //add event listener for desktop capture
    window.addEventListener("message", callback, false);

    window.postMessage("are-you-there", "*");
  };

  /*
   * Call check extension. Below function is called when this class is created
   */
  thiz.checkExtension();

  /*
   * (Below lines are executed as well when this class is created)
   * What it does (TLDR):  
   */
  // A. if it is not playing, create the stream.
  if (
    !this.isPlayMode &&
    typeof thiz.mediaConstraints != "undefined" &&
    this.localStream == null
  ) {
    if (
      typeof thiz.mediaConstraints.video != "undefined" &&
      thiz.mediaConstraints.video != false
    ) {
      // if it is not play mode and media constraint is defined, try to get user media
      if (thiz.mediaConstraints.audio.mandatory) {
        //this case captures mic and video(audio(screen audio) + video(screen)) and then provide mute/unmute mic with
        //enableMicInMixedAudio
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(function (micStream) {
            navigator.mediaDevices
              .getUserMedia(thiz.mediaConstraints)
              .then(function (stream) {
                //console.debug("audio stream track count: " + audioStream.getAudioTracks().length);

                var audioContext = new AudioContext();
                var desktopSoundGainNode = audioContext.createGain(); // creates a gainNode which can be used to control the overall gain (or volume) of the audio graph.

                desktopSoundGainNode.gain.value = 1;

                // Creation of two audio source: the audio from the screen-sharing and the mic
                var audioDestination = audioContext.createMediaStreamDestination();
                var audioSource = audioContext.createMediaStreamSource(stream);

                audioSource.connect(desktopSoundGainNode); // connect source audio to the gainNode button (which will control the output)

                thiz.micGainNode = audioContext.createGain(); // creates a gainNode which can be used to control the overall gain (or volume) of the audio graph.
                thiz.micGainNode.gain.value = 1;
                var audioSource2 = audioContext.createMediaStreamSource(
                  micStream
                );
                audioSource2.connect(thiz.micGainNode);

                desktopSoundGainNode.connect(audioDestination);
                thiz.micGainNode.connect(audioDestination);

                stream.removeTrack(stream.getAudioTracks()[0]); // By defintiion of that stream, a little bit above, we take video + audio from getMediaUser and want to remove that audio from the mic.
                audioDestination.stream
                  .getAudioTracks()
                  .forEach(function (track) {
                    stream.addTrack(track);
                  });

                console.debug("Running gotStream");
                thiz.gotStream(stream);
              })
              .catch(function (error) {
                thiz.callbackError(error.name, error.message);
              });
          })
          .catch(function (error) {
            thiz.callbackError(error.name, error.message);
          });
      } else {
        //most of the times, this statement runs
        thiz.openStream(thiz.mediaConstraints, thiz.mode);
      }
    } else {
      // get only audio
      var media_audio_constraint = { audio: thiz.mediaConstraints.audio };
      navigator.mediaDevices
        .getUserMedia(media_audio_constraint)
        .then(function (stream) {
          thiz.gotStream(stream);
        })
        .catch(function (error) {
          thiz.callbackError(error.name, error.message);
        });
    }
  // B. If it is already running, only do something if ws is broken.
  } else {
    //just playing, it does not open any stream
    if (
      thiz.webSocketAdaptor == null ||
      thiz.webSocketAdaptor.isConnected() == false
    ) {
      thiz.webSocketAdaptor = new WebSocketAdaptor();
    }
  }

  this.enableMicInMixedAudio = function (enable) {
    if (thiz.micGainNode != null) {
      if (enable) {
        thiz.micGainNode.gain.value = 1;
      } else {
        thiz.micGainNode.gain.value = 0;
      }
    }
  };

  this.publish = function (streamId, token) {
    var jsCmd = {
      command: "publish",
      streamId: streamId,
      token: token,
      video: thiz.localStream.getVideoTracks().length > 0 ? true : false,
      audio: thiz.localStream.getAudioTracks().length > 0 ? true : false,
    };

    thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
  };

  // if you know what the difference is between joinRoom and join, please tell Remy.
  this.joinRoom = function (roomName, streamId) {
    thiz.roomName = roomName;

    var jsCmd = {
      command: "joinRoom",
      room: roomName,
      streamId: streamId,
    };

    thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
  };

  this.play = function (streamId, token, roomId) {
    thiz.playStreamId.push(streamId);
    var jsCmd = {
      command: "play",
      streamId: streamId,
      token: token,
      room: roomId,
    };

    thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
  };

  this.stop = function (streamId) {
    thiz.closePeerConnection(streamId);

    var jsCmd = {
      command: "stop",
      streamId: streamId,
    };

    thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
  };

  this.join = function (streamId) {
    var jsCmd = {
      command: "join",
      streamId: streamId,
    };

    thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
  };

  // if you know the difference between leaveFromRoom and leave, please tell Remy.
  this.leaveFromRoom = function (roomName) {
    thiz.roomName = roomName;
    var jsCmd = {
      command: "leaveFromRoom",
      room: roomName,
    };
    console.log("leave request is sent for " + roomName);

    thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
  };

  this.leave = function (streamId) {
    var jsCmd = {
      command: "leave",
      streamId: streamId,
    };

    thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
    thiz.closePeerConnection(streamId);
  };

  this.getStreamInfo = function (streamId) {
    var jsCmd = {
      command: "getStreamInfo",
      streamId: streamId,
    };
    this.webSocketAdaptor.send(JSON.stringify(jsCmd));
  };

  // function that links stream html element and resets ws if it is not setup
  this.gotStream = function (stream) {
    thiz.localStream = stream;
    console.log(thiz.localVideoId);
    thiz.localVideo = document.getElementById(thiz.localVideoId);
    console.log(thiz.localVideo);
    thiz.localVideo.srcObject = stream;
    if (
      thiz.webSocketAdaptor == null ||
      thiz.webSocketAdaptor.isConnected() == false
    ) {
      thiz.webSocketAdaptor = new WebSocketAdaptor();
    }
  };

  this.switchVideoCapture = function (streamId) {
    var mediaConstraints = {
      video: true,
      audio: false,
    };

    thiz.switchVideoSource(streamId, mediaConstraints, null);
  };

  this.switchDesktopCapture = function (streamId) {
    var screenShareExtensionCallback = function (message) {
      if (message.data == "rtcmulticonnection-extension-loaded") {
        console.debug(
          "rtcmulticonnection-extension-loaded parameter is received"
        );
        window.postMessage("get-sourceId", "*");
      } else if (message.data == "PermissionDeniedError") {
        console.debug("Permission denied error");
        thiz.callbackError("screen_share_permission_denied");
      } else if (message.data && message.data.sourceId) {
        var mediaConstraints = {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: message.data.sourceId,
            },
            optional: [],
          },
        };

        thiz.switchVideoSource(streamId, mediaConstraints, function (event) {
          thiz.callback("screen_share_stopped");
          thiz.switchVideoCapture(streamId);
        });

        //remove event listener
        window.removeEventListener("message", screenShareExtensionCallback);
      }
    };

    //add event listener for desktop capture
    window.addEventListener("message", screenShareExtensionCallback, false);

    window.postMessage("are-you-there", "*");
  };

  thiz.arrangeStreams = function (stream, onEndedCallback) {
    var videoTrack = thiz.localStream.getVideoTracks()[0];
    thiz.localStream.removeTrack(videoTrack);
    videoTrack.stop();
    thiz.localStream.addTrack(stream.getVideoTracks()[0]);
    thiz.localVideo.srcObject = thiz.localStream;
    if (onEndedCallback != null) {
      stream.getVideoTracks()[0].onended = function (event) {
        onEndedCallback(event);
      };
    }
  };

  this.switchVideoSource = function (
    streamId,
    mediaConstraints,
    onEndedCallback
  ) {
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(function (stream) {
        if (thiz.remotePeerConnection[streamId] != null) {
          var videoTrackSender = thiz.remotePeerConnection[streamId]
            .getSenders()
            .find(function (s) {
              return s.track.kind == "video";
            });

          videoTrackSender
            .replaceTrack(stream.getVideoTracks()[0])
            .then(function (result) {
              thiz.arrangeStreams(stream, onEndedCallback);
            })
            .catch(function (error) {
              console.log(error.name);
            });
        } else {
          thiz.arrangeStreams(stream, onEndedCallback);
        }
      })
      .catch(function (error) {
        thiz.callbackError(error.name);
      });
  };

  //  Q: what event are we talking about here? If you know, tell Remy.
  this.onTrack = function (event, streamId) {
    console.log("onTrack");
    if (thiz.remoteVideo != null) {
      //thiz.remoteVideo.srcObject = event.streams[0];
      if (thiz.remoteVideo.srcObject !== event.streams[0]) {
        thiz.remoteVideo.srcObject = event.streams[0];
        console.log("Received remote stream");
      }
    } else {
      var dataObj = {
        track: event.streams[0],
        streamId: streamId,
      };
      thiz.callback("newStreamAvailable", dataObj);
    }
  };

/* "The RTCPeerConnection interface represents a WebRTC connection between the 
local computer and a remote peer. It provides methods to connect to a remote 
peer, maintain and monitor the connection, and close the connection once it's 
no longer needed." 

"An icecandidate event is sent to an RTCPeerConnection  when an RTCIceCandidate 
has been identified and added to the local peer by a call to 
RTCPeerConnection.setLocalDescription(). The event handler should transmit 
the candidate to the remote peer over the signaling channel so the remote peer 
can add it to its set of remote candidates."


TLDR: accepts a candidate in the stream via RTP peer connection
*/
  this.iceCandidateReceived = function (event, streamId) {
    if (event.candidate) {
      var jsCmd = {
        command: "takeCandidate",
        streamId: streamId,
        label: event.candidate.sdpMLineIndex, //The read-only sdpMLineIndex property on the RTCIceCandidate interface is a zero-based index of the m-line describing the media associated with the candidate
        id: event.candidate.sdpMid, // The read-only property sdpMid on the RTCIceCandidate interface returns a DOMString specifying the media stream identification tag of the media component with which the candidate is associated. This ID uniquely identifies a given stream for the component with which the candidate is associated.
        candidate: event.candidate.candidate,
      };

      if (thiz.debug) {
        console.log("sending ice candiate for stream Id " + streamId);
        console.log(JSON.stringify(event.candidate));
      }

      thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
    }
  };

  // creates RTCPeerConnection; adds the current media (thiz.localStream) to the RTCPeerConnection
  this.initPeerConnection = function (streamId) {
    if (thiz.remotePeerConnection[streamId] == null) {
      var closedStreamId = streamId;
      console.log(
        "stream id in init peer connection: " +
          streamId +
          " close dstream id: " +
          closedStreamId
      );
      thiz.remotePeerConnection[streamId] = new RTCPeerConnection(
        thiz.peerconnection_config
      );
      thiz.remoteDescriptionSet[streamId] = false;
      thiz.iceCandidateList[streamId] = new Array();
      if (!thiz.playStreamId.includes(streamId)) {
        thiz.remotePeerConnection[streamId].addStream(thiz.localStream);
      }
      thiz.remotePeerConnection[streamId].onicecandidate = function (event) {
        thiz.iceCandidateReceived(event, closedStreamId);
      };
      thiz.remotePeerConnection[streamId].ontrack = function (event) {
        thiz.onTrack(event, closedStreamId);
      };

      if (!thiz.isPlayMode) {
        thiz.remotePeerConnection[
          streamId
        ].oniceconnectionstatechange = function (event) {
          if (
            thiz.remotePeerConnection[streamId].iceConnectionState ==
            "connected"
          ) {
            thiz
              .changeBandwidth(thiz.bandwidth, streamId)
              .then(() => {
                console.log("Bandwidth is changed to " + thiz.bandwidth);
              })
              .catch((e) => console.error(e));
          }
        };
      }
    }
  };

  this.closePeerConnection = function (streamId) {
    if (
      thiz.remotePeerConnection[streamId] != null &&
      thiz.remotePeerConnection[streamId].signalingState != "closed"
    ) {
      thiz.remotePeerConnection[streamId].close();
      thiz.remotePeerConnection[streamId] = null;
      delete thiz.remotePeerConnection[streamId];
      var playStreamIndex = thiz.playStreamId.indexOf(streamId);
      if (playStreamIndex != -1) {
        thiz.playStreamId.splice(playStreamIndex, 1);
      }
    }

    if (thiz.remotePeerConnectionStats[streamId] != null) {
      clearInterval(thiz.remotePeerConnectionStats[streamId].timerId);
      delete thiz.remotePeerConnectionStats[streamId];
    }
  };

  this.signallingState = function (streamId) {
    if (thiz.remotePeerConnection[streamId] != null) {
      return thiz.remotePeerConnection[streamId].signalingState;
    }
    return null;
  };

  this.iceConnectionState = function (streamId) {
    if (thiz.remotePeerConnection[streamId] != null) {
      return thiz.remotePeerConnection[streamId].iceConnectionState;
    }
    return null;
  };

  // function that changes the SDP (session description protocole) of the communication with Antmedia server
  this.gotDescription = function (configuration, streamId) {
    thiz.remotePeerConnection[streamId]
      .setLocalDescription(configuration)
      .then(function (response) {
        console.debug(
          "Set local description successfully for stream Id " + streamId
        );

        var jsCmd = {
          command: "takeConfiguration",
          streamId: streamId,
          type: configuration.type,
          sdp: configuration.sdp,
        };

        if (thiz.debug) {
          console.debug("local sdp: ");
          console.debug(configuration.sdp);
        }

        thiz.webSocketAdaptor.send(JSON.stringify(jsCmd));
      })
      .catch(function (error) {
        console.error("Cannot set local description. Error is: " + error);
      });
  };

  this.turnOffLocalCamera = function () {
    if (thiz.remotePeerConnection != null) {
      var track = thiz.localStream.getVideoTracks()[0];
      track.enabled = false;
    } else {
      this.callbackError("NoActiveConnection");
    }
  };

  this.turnOnLocalCamera = function () {
    if (thiz.remotePeerConnection != null) {
      var track = thiz.localStream.getVideoTracks()[0];
      track.enabled = true;
    } else {
      this.callbackError("NoActiveConnection");
    }
  };

  this.muteLocalMic = function () {
    if (thiz.remotePeerConnection != null) {
      var track = thiz.localStream.getAudioTracks()[0];
      track.enabled = false;
    } else {
      this.callbackError("NoActiveConnection");
    }
  };

  /**
   * if there is audio it calls callbackError with "AudioAlreadyActive" parameter
   */
  this.unmuteLocalMic = function () {
    if (thiz.remotePeerConnection != null) {
      var track = thiz.localStream.getAudioTracks()[0];
      track.enabled = true;
    } else {
      this.callbackError("NoActiveConnection");
    }
  };

  // function for the receiver to take the SDP offer
  this.takeConfiguration = function (
    idOfStream,
    configuration,
    typeOfConfiguration
  ) {
    var streamId = idOfStream;
    var type = typeOfConfiguration;
    var conf = configuration;

    thiz.initPeerConnection(streamId);

    thiz.remotePeerConnection[streamId]
      .setRemoteDescription(
        new RTCSessionDescription({
          sdp: conf,
          type: type,
        })
      )
      .then(function (response) {
        if (thiz.debug) {
          console.debug(
            "set remote description is succesfull with response: " +
              response +
              " for stream : " +
              streamId +
              " and type: " +
              type
          );
          console.debug(conf);
        }

        thiz.remoteDescriptionSet[streamId] = true;
        var length = thiz.iceCandidateList[streamId].length;
        console.debug("Ice candidate list size to be added: " + length);
        for (var i = 0; i < length; i++) {
          thiz.addIceCandidate(streamId, thiz.iceCandidateList[streamId][i]);
        }
        thiz.iceCandidateList[streamId] = [];

        if (type == "offer") {
          //SDP constraints may be different in play mode
          console.log("try to create answer for stream id: " + streamId);

          thiz.remotePeerConnection[streamId]
            .createAnswer(thiz.sdp_constraints)
            .then(function (configuration) {
              console.log("created answer for stream id: " + streamId);
              thiz.gotDescription(configuration, streamId);
            })
            .catch(function (error) {
              console.error("create answer error :" + error);
            });
        }
      })
      .catch(function (error) {
        if (thiz.debug) {
          console.error(
            "set remote description is failed with error: " + error
          );
        }
        if (
          error.toString().indexOf("InvalidAccessError") > -1 ||
          error.toString().indexOf("setRemoteDescription") > -1
        ) {
          /**
           * This error generally occurs in codec incompatibility.
           * AMS for a now supports H.264 codec. This error happens when some browsers try to open it from VP8.
           */
          thiz.callbackError("notSetRemoteDescription");
        }
      });
  };

  this.takeCandidate = function (idOfTheStream, tmpLabel, tmpCandidate) {
    var streamId = idOfTheStream;
    var label = tmpLabel;
    var candidateSdp = tmpCandidate;

    var candidate = new RTCIceCandidate({
      sdpMLineIndex: label,
      candidate: candidateSdp,
    });

    thiz.initPeerConnection(streamId);

    if (thiz.remoteDescriptionSet[streamId] == true) {
      thiz.addIceCandidate(streamId, candidate);
    } else {
      console.debug(
        "Ice candidate is added to list because remote description is not set yet"
      );
      thiz.iceCandidateList[streamId].push(candidate);
    }
  };

  this.addIceCandidate = function (streamId, candidate) {
    thiz.remotePeerConnection[streamId]
      .addIceCandidate(candidate)
      .then(function (response) {
        if (thiz.debug) {
          console.log("Candidate is added for stream " + streamId);
        }
      })
      .catch(function (error) {
        console.error(
          "ice candiate cannot be added for stream id: " +
            streamId +
            " error is: " +
            error
        );
        console.error(candidate);
      });
  };

  this.startPublishing = function (idOfStream) {
    var streamId = idOfStream;

    thiz.initPeerConnection(streamId);

    thiz.remotePeerConnection[streamId]
      .createOffer(thiz.sdp_constraints)
      .then(function (configuration) {
        thiz.gotDescription(configuration, streamId);
      })
      .catch(function (error) {
        console.log(
          "create offer error for stream id: " + streamId + " error: " + error
        );
      });
  };

  /**
   * If we have multiple video tracks in coming versions, this method may cause some issues
   */
  this.getVideoSender = function (streamId) {
    var videoSender = null;
    if (
      (adapter.browserDetails.browser === "chrome" ||
        (adapter.browserDetails.browser === "firefox" &&
          adapter.browserDetails.version >= 64)) &&
      "RTCRtpSender" in window &&
      "setParameters" in window.RTCRtpSender.prototype
    ) {
      const senders = thiz.remotePeerConnection[streamId].getSenders();

      for (let i = 0; i < senders.length; i++) {
        if (senders[i].track != null && senders[i].track.kind == "video") {
          videoSender = senders[i];
          break;
        }
      }
    }
    return videoSender;
  };

  /**
   * bandwidth is in kbps
   */
  this.changeBandwidth = function (bandwidth, streamId) {
    var errorDefinition = "";

    var videoSender = thiz.getVideoSender(streamId);

    if (videoSender != null) {
      const parameters = videoSender.getParameters();

      if (!parameters.encodings) {
        parameters.encodings = [{}];
      }

      if (bandwidth === "unlimited") {
        delete parameters.encodings[0].maxBitrate;
      } else {
        parameters.encodings[0].maxBitrate = bandwidth * 1000;
      }

      return videoSender.setParameters(parameters);
    } else {
      errorDefinition = "Video sender not found to change bandwidth";
    }

    return Promise.reject(errorDefinition);
  };

  this.getStats = function (streamId) {
    thiz.remotePeerConnection[streamId].getStats(null).then((stats) => {
      var bytesReceived = 0;
      var packetsLost = 0;
      var fractionLost = 0;
      var currentTime = 0;
      var bytesSent = 0;

      stats.forEach((value) => {
        if (value.type == "inbound-rtp") {
          bytesReceived += value.bytesReceived;
          packetsLost += value.packetsLost;
          fractionLost += value.fractionLost;
          currentTime = value.timestamp;
        } else if (value.type == "outbound-rtp") {
          bytesSent += value.bytesSent;
          currentTime = value.timestamp;
        }
      });

      thiz.remotePeerConnectionStats[
        streamId
      ].totalBytesReceived = bytesReceived;
      thiz.remotePeerConnectionStats[streamId].packetsLost = packetsLost;
      thiz.remotePeerConnectionStats[streamId].fractionLost = fractionLost;
      thiz.remotePeerConnectionStats[streamId].currentTime = currentTime;
      thiz.remotePeerConnectionStats[streamId].totalBytesSent = bytesSent;

      thiz.callback("updated_stats", thiz.remotePeerConnectionStats[streamId]);
    });
  };

  this.enableStats = function (streamId) {
    thiz.remotePeerConnectionStats[streamId] = new PeerStats(streamId);
    thiz.remotePeerConnectionStats[streamId].timerId = setInterval(() => {
      thiz.getStats(streamId);
    }, 5000);
  };

  /**
   * After calling this function, create new WebRTCAdaptor instance, don't use the the same objectone
   * Because all streams are closed on server side as well when websocket connection is closed.
   */
  this.closeWebSocket = function () {
    for (var key in thiz.remotePeerConnection) {
      thiz.remotePeerConnection[key].close();
    }
    //free the remote peer connection by initializing again
    thiz.remotePeerConnection = new Array();
    thiz.webSocketAdaptor.close();
  };

  function WebSocketAdaptor() {
    var wsConn = new WebSocket(thiz.websocket_url);

    var connected = false;

    var pingTimerId = -1;

    var clearPingTimer = function () {
      if (pingTimerId != -1) {
        if (thiz.debug) {
          console.debug("Clearing ping message timer");
        }
        clearInterval(pingTimerId);
        pingTimerId = -1;
      }
    };

    var sendPing = function () {
      var jsCmd = {
        command: "ping",
      };
      wsConn.send(JSON.stringify(jsCmd));
    };

    this.close = function () {
      wsConn.close();
    };

    wsConn.onopen = function () {
      if (thiz.debug) {
        console.log("websocket connected");
      }

      pingTimerId = setInterval(() => {
        sendPing();
      }, 3000);

      connected = true;
      thiz.callback("initialized");
    };

    this.send = function (text) {
      if (
        wsConn.readyState == 0 ||
        wsConn.readyState == 2 ||
        wsConn.readyState == 3
      ) {
        thiz.callbackError("WebSocketNotConnected");
        return;
      }
      wsConn.send(text);
      console.log("sent message:" + text);
    };

    this.isConnected = function () {
      return connected;
    };

    wsConn.onmessage = function (event) {
      var obj = JSON.parse(event.data);

      if (obj.command == "start") {
        //this command is received first, when publishing so playmode is false

        if (thiz.debug) {
          console.debug("received start command");
        }

        thiz.startPublishing(obj.streamId);
      } else if (obj.command == "takeCandidate") {
        if (thiz.debug) {
          console.debug("received ice candidate for stream id " + obj.streamId);
          console.debug(obj.candidate);
        }

        thiz.takeCandidate(obj.streamId, obj.label, obj.candidate);
      } else if (obj.command == "takeConfiguration") {
        if (thiz.debug) {
          console.log(
            "received remote description type for stream id: " +
              obj.streamId +
              " type: " +
              obj.type
          );
        }
        thiz.takeConfiguration(obj.streamId, obj.sdp, obj.type);
      } else if (obj.command == "stop") {
        console.debug("Stop command received");
        thiz.closePeerConnection(obj.streamId);
      } else if (obj.command == "error") {
        thiz.callbackError(obj.definition);
      } else if (obj.command == "notification") {
        thiz.callback(obj.definition, obj);
        if (
          obj.definition == "play_finished" ||
          obj.definition == "publish_finished"
        ) {
          thiz.closePeerConnection(obj.streamId);
        }
      } else if (obj.command == "streamInformation") {
        thiz.callback(obj.command, obj);
      } else if (obj.command == "pong") {
        thiz.callback(obj.command);
      }
    };

    wsConn.onerror = function (error) {
      console.log(" error occured: " + JSON.stringify(error));
      clearPingTimer();
      thiz.callbackError(error);
    };

    wsConn.onclose = function (event) {
      connected = false;
      console.log("connection closed.");
      clearPingTimer();
      thiz.callback("closed", event);
    };
  }
}
