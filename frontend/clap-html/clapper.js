let count = 0;

$(document).ready(function () {
    $(window).keydown(function (e) {
        if (e.keyCode == 0 || e.keyCode == 32) {
            if (count == 0) {
                var audio = new Audio('applause4.mp3');
                audio.volume = Math.min(0.1 + count / 10, 0.5);
                audio.play();
            }
            count += 1;
            // Getting volume level
            const volume = audio.volume;
            document.write("Volume: " + volume);
            // Setting volume level
        }
    });
});