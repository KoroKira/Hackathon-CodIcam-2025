const hair = document.querySelector('.hair');
const hairLengthDisplay = document.getElementById('hair-length');
const timeElapsedDisplay = document.getElementById('time-elapsed');

let hairLength = 0; // en mm
let timeElapsed = 0; // en jours
const growthRate = 0.3; // 0.3 mm par jour

function growHair() {
    // Mise à jour de la longueur des cheveux
    hairLength += growthRate;
    hair.style.height = `${hairLength}px`; // On utilise px pour la hauteur
    hairLengthDisplay.textContent = hairLength.toFixed(1);

    // Mise à jour du temps écoulé
    timeElapsed += 1;
    timeElapsedDisplay.textContent = timeElapsed;

    // On rappelle la fonction toutes les 24 heures (en millisecondes)
    setTimeout(growHair, 1000); // 1000 ms = 1 seconde (pour la démo, sinon 86400000 ms = 1 jour)
}

// Démarre la simulation
growHair();