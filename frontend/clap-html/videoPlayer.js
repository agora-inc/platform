var myVideo = document.getElementById("video-element");

function playPauseVideo() {
    if (myVideo.paused)
        myVideo.play();
    else
        myVideo.pause();
}
 
//the video always maintains its original aspect ratio
function makeBig() {
    myVideo.width = 560;
}
 
function makeSmall() {
    myVideo.width = 320;
}
 
function makeNormal() {
    myVideo.width = 420;
}

function setVolume(tag) {
    if (tag == "up") {
        myVideo.volume = Math.min(myVideo.volume + 0.05, 1);
    } else if (tag == "down") {
        myVideo.volume = Math.max(myVideo.volume - 0.05, 0);
    } else {
        throw new RangeError('Command not defined');
    }
}