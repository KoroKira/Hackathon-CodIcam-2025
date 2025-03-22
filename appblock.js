document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cleanButton').addEventListener('click', () => {
        // Sélectionne tous les éléments de la page
        const allElements = document.body.getElementsByTagName('*');
        
        // Parcourt tous les éléments et cache ceux qui ne sont pas des pubs
        for (let element of allElements) {
            if (!element.classList.contains('ad')) {
                element.style.display = 'none';
            }
        }
        
        // Ajoute un message rigolo
        const ads = document.querySelectorAll('.ad');
        ads.forEach(ad => {
            ad.innerHTML += '<br><small>😘 Merci de soutenir notre contenu !</small>';
            ad.style.fontSize = '2em';
            ad.style.padding = '50px';
            ad.style.margin = '20px';
        });
    });
});