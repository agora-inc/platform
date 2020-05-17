function playMixture(sounds, intensities) {
    try {
        if (sounds.length != intensities.length) {
            throw new RangeError('Intensities and sounds does have the same length.');
        }

        totalIntensity = arrSum(intensities);

        for (i = 0; i < sounds.length; i++) {
            sounds[i].volume = intensities[i] / totalIntensity;
            // console.log(sounds[i].volume);
            sounds[i].play();
        }

    } catch(e) {
        if (e.name === "RangeError") {

        }
    }
}

function play() {
    sounds = [new Audio('applause4.mp3'), new Audio('auditorium.mp3')];
    intensities = [9, 1];
    playMixture(sounds, intensities);
}

const arrSum = arr => arr.reduce((a,b) => a + b, 0.0)