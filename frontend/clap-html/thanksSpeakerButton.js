function thanksSpeaker() {
    // Display overlay
    css = {opacity: 1};
    $(".overlay").css(css);
    $(".overlay").show();

    // Start timer
    const start = Date.now();

    // Reduce volume of video
    var myVideo = document.getElementById("video-element");
    myVideo.volume = 0.2;

    var audioUser = new Audio('applause-5.mp3');
    audioUser.volume = 0.0;
    audioUser.play();

    // Start custom clapping
    document.addEventListener('keydown', event => {
        if (event.keyCode == 0 || event.keyCode == 32) {
            // Setting volume level
            audioUser.volume = Math.min(audioUser.volume + 0.05, 1.0)
        }
    });
    
     // Start base clapping
     var audioBase = new Audio('applause-7.mp3');
     var startVolume = 0.2;
     audioBase.volume = startVolume;
     audioBase.play();

    // Define timing
    var totalTimeClap = 10000.0;   // milliseconds
    var updateFrequency = 200.0;  // milliseconds
    var nUpdates = totalTimeClap / updateFrequency;

    var countUpdates = 0;
    var ratio = 0;
    var intervalID = window.setInterval(myCallback, updateFrequency);
    var removeOverlay = true;

    function myCallback() {
        countUpdates += 1;
        if (countUpdates > nUpdates) {
            audioBase.volume = 0.0;
            audioUser.volume = 0.0;
            myVideo.volume = 0.4;
            clearInterval(intervalID);
            return; 
        }
        if (countUpdates >= 0.7*nUpdates & removeOverlay) {
            css = {opacity: 0};
            $(".overlay").css(css);
            $(".overlay").show();
            removeOverlay = false;
        }

        ratio = countUpdates / nUpdates
        audioBase.volume = Math.max(0.0, Math.min(1.0, 4*(1-ratio)*(ratio + startVolume/4) + 0.5 *  Math.sqrt(ratio * (1-ratio)) * (Math.random()-0.5)));
        audioUser.volume = Math.max(audioUser.volume - 0.03, 0.0)
        console.log("Volume base: " + audioBase.volume);
        console.log("Volume user: " + audioUser.volume);
    }
}

function thanksEveryone() {
    // Stop overlay
    css = {opacity: 0};
    $(".overlay").css(css);
    $(".overlay").show();

    // Mute clapping

    // Get video volume back on again
}