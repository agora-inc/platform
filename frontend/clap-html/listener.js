
/*
document.addEventListener('DOMContentLoaded', () => {
        'use strict';
        let count = 0;
        var audio = new Audio('applause4.mp3');

        document.addEventListener('keydown', event => {
            if (event.keyCode == 0 || event.keyCode == 32) {
                if (count == 0) {
                    audio.volume = 0.1;
                    audio.play();
                }
                count += 1;
                // Getting volume level
                const volume = audio.volume;
                console.log("Volume: " + volume);
                // Setting volume level
                audio.volume = Math.min(0.1 + count / 10.0, 1.0)
            }
        });
});
*/

let count = 0;
        var audio = new Audio('applause4.mp3');

document.addEventListener('keydown', event => {
    if (event.keyCode == 0 || event.keyCode == 32) {
        if (count == 0) {
            audio.volume = 0.1;
            audio.play();
        }
        count += 1;
        // Getting volume level
        const volume = audio.volume;
        console.log("Volume: " + volume);
        // Setting volume level
        audio.volume = Math.min(0.1 + count / 10.0, 1.0)
    }
});