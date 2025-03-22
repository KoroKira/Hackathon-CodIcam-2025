document.addEventListener('DOMContentLoaded', () => {
    const cleanButton = document.getElementById('cleanButton');
    
    // Rotation des messages publicitaires
    const adMessages = [
        "DERNIÈRE CHANCE !",
        "10 PERSONNES REGARDENT CETTE PAGE !",
        "FÉLICITATIONS ! VOUS ÊTES LE 1000E VISITEUR !"
    ];
    
    setInterval(() => {
        document.getElementById('dynamicAd').textContent = 
            adMessages[Math.floor(Math.random() * adMessages.length)];
    }, 5000);

    // Gestion du nettoyage
    cleanButton.addEventListener('click', () => {
        // Supprime le contenu éditorial
        document.querySelectorAll('article, h1, h2, p, img, nav').forEach(el => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        });

        // Met en avant les pubs
        document.querySelectorAll('.ad-top, .ad-sidebar, .ad-in-article').forEach(ad => {
            ad.style.transform = 'scale(1.1)';
            ad.style.margin = '20px 0';
            ad.style.zIndex = '1001';
            ad.innerHTML += '<div class="text-muted mt-2">Merci à nos sponsors 💖</div>';
        });

        // Désactive le bouton
        cleanButton.textContent = 'Nettoyage terminé ✅';
        cleanButton.disabled = true;
    });

    // Pop-up quand la souris sort
    document.addEventListener('mouseout', (e) => {
        if (e.clientY < 50) {
            document.querySelector('.ad-popup').style.display = 'block';
        }
    });
});