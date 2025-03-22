const raindropsContainer = document.querySelector('.raindrops');
const countElement = document.getElementById('count');
let count = 0;

function createRaindrop() {
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    raindrop.style.left = `${Math.random() * 100}%`; // Position horizontale aléatoire
    raindrop.style.animationDuration = `${Math.random() * 2 + 1}s`; // Durée aléatoire

    // Ajouter la goutte de pluie à la fenêtre
    raindropsContainer.appendChild(raindrop);

    // Vérifier si la goutte sort de la fenêtre
    const checkPosition = () => {
        const raindropRect = raindrop.getBoundingClientRect();
        const windowRect = raindropsContainer.getBoundingClientRect();

        // Si la goutte dépasse le bas de la fenêtre
        if (raindropRect.bottom > windowRect.bottom) {
            raindrop.remove(); // Supprimer la goutte
            count++; // Incrémenter le compteur
            countElement.textContent = count; // Mettre à jour l'affichage
        } else {
            requestAnimationFrame(checkPosition); // Continuer à vérifier
        }
    };

    // Démarrer la vérification
    requestAnimationFrame(checkPosition);
}

// Créer une nouvelle goutte de pluie toutes les 200 millisecondes
setInterval(createRaindrop, 200);