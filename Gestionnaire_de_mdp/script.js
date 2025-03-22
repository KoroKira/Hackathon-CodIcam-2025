document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('passwordForm');
    const passwordList = document.getElementById('passwordList');

    passwordForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const service = document.getElementById('service').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Afficher une pop-up pour faire semblant d'oublier le mot de passe
        setTimeout(() => {
            alert("Mince, j'ai oublié votre mot de passe ! Pouvez-vous le répéter ?");
        }, 1000); // 1 seconde de délai pour l'effet comique

        // Réinitialiser le formulaire
        passwordForm.reset();

        // Ajouter une entrée "oubliée" à la liste
        const li = document.createElement('li');
        li.textContent = `${service} - ${username}: [Mot de passe oublié]`;
        passwordList.appendChild(li);
    });
});