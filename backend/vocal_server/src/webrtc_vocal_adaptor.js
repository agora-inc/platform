/**
 * Script allowing broadcasting of vocal data using WebRTC with signaling 
 * based on ICE done on the Antmedia server as Multi-point control unit.
 
 */

"use strict";

function WebRTCVocalAdaptor(initialValues){
     // A. Setting global stats
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
     * B) Setting RTCPeerConnection 
     * 
     * Check https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity
     * for detail of the below protocol.
     * 
     * Quick description of protocol:
     * 1. The caller captures local Media via navigator.mediaDevices.getUserMedia() 
     * 2. The caller creates RTCPeerConnection and called RTCPeerConnection.addTrack() (Since addStream is deprecating)
     * 3. The caller calls RTCPeerConnection.createOffer() to create an offer.
     * 4. The caller calls RTCPeerConnection.setLocalDescription() to set that offer as the local description (that is, the description of the local end of the connection).
     * 5. After setLocalDescription(), the caller asks STUN servers to generate the ice candidates
     * 6. The caller uses the signaling server to transmit the offer to the intended receiver of the call.
     * 7. The recipient receives the offer and calls RTCPeerConnection.setRemoteDescription() to record it as the remote description (the description of the other end of the connection).
     * 8. The recipient does any setup it needs to do for its end of the call: capture its local media, and attach each media tracks into the peer connection via RTCPeerConnection.addTrack()
     * 9. The recipient then creates an answer by calling RTCPeerConnection.createAnswer().
     * 10. The recipient calls RTCPeerConnection.setLocalDescription(), passing in the created answer, to set the answer as its local description. The recipient now knows the configuration of both ends of the connection.
     * 11. The recipient uses the signaling server to send the answer to the caller.
     * 12. The caller receives the answer.
     * 13. The caller calls RTCPeerConnection.setRemoteDescription() to set the answer as the remote description for its end of the call. It now knows the configuration of both peers. Media begins to flow as configured.
    */


    this.DEBUG_setMicIntoFrontEnd = function (stream){
        if (window.URL) {
        MicAudioController.srcObject = stream;
        } else {
        MicAudioController.srcObject = stream; // 
        }
    };


    this.getMicStream = function () {
      const MicAudioController = document.getElementById('MicAudioController');
      const constraints = {audio: true, video: false}

      const handleSuccess = function(stream) {
          // DEBUG
          this.DEBUG_setMicIntoFrontEnd(stream)

          // PLACEHOLDER
      };
      navigator.mediaDevices.getUserMedia(constraints)
          .then(handleSuccess);
  }

    this.getUserMedia = function (mediaConstraints, audioConstraint) {
        // self refers to the context of this function only
        const self = this;
        navigator.mediaDevices
          .getUserMedia(mediaConstraints)
          .then(function (stream) {  
            // now get only audio to add this stream
            if (audioConstraint != "undefined" && audioConstraint != false) {
              var media_audio_constraint = { audio: audioConstraint };
              navigator.mediaDevices
                .getUserMedia(media_audio_constraint)
                .then(function (audioStream) {
                    stream.addTrack(audioStream.getAudioTracks()[0]);
                    self.gotStream(stream);
                  }
                )
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

    this.initRTCPeerConnection = function () {
        /**
        i) create RTCPeerConnection
        ii) add stream to track
        iii) set local description
        iv) ask STUN server to generate ICE candidates
        v) use the signaling server to transmit the offer
        */
    }

    // set RTCPeerConnection receiver
    this.SetRtcPeerConnectionReceiver = function () {
        /**
        i) The recipient receives the offer and calls RTCPeerConnection.setRemoteDescription() to record it as the remote description (the description of the other end of the connection).
        ii) The recipient does any setup it needs to do for its end of the call: capture its local media, and attach each media tracks into the peer connection via RTCPeerConnection.addTrack()
        iii) The recipient then creates an answer by calling RTCPeerConnection.createAnswer().
        iv) The recipient calls RTCPeerConnection.setLocalDescription(), passing in the created answer, to set the answer as its local description. The recipient now knows the configuration of both ends of the connection.
        v) The recipient uses the signaling server to send the answer to the caller.
        */
    }   




 }