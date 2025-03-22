document.addEventListener('DOMContentLoaded', () => {
    const wordForm = document.getElementById('wordForm');
    const wordInput = document.getElementById('wordInput');
    const cloudContainer = document.getElementById('cloudContainer');

    wordForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const word = wordInput.value.trim().toLowerCase();

        if (word === "nuage") {
            // Ajouter le mot "nuage" au nuage de mots
            const span = document.createElement('span');
            span.textContent = "nuage ";
            span.style.fontSize = `${Math.random() * 40 + 20}px`; // Taille aléatoire
            span.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`; // Couleur aléatoire
            cloudContainer.appendChild(span);

            // Réinitialiser le champ de saisie
            wordInput.value = "";
        } else {
            // Afficher une pop-up pour dire que le mot n'est pas valable
            alert("Désolé, seul le mot 'nuage' est autorisé !");
        }
    });
});