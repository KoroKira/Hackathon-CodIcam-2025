// biere.js

document.addEventListener("DOMContentLoaded", () => {
    // Récupération des éléments du DOM
    const startButton = document.getElementById("startButton");
    const volumeSelect = document.getElementById("volumeSelect");
    const typeSelect = document.getElementById("typeSelect");
    const foamSelect = document.getElementById("foamSelect");
    const canvas = document.getElementById("beerCanvas");
    const ctx = canvas.getContext("2d");
  
    // Dimensions et position du verre dans le canvas
    const glass = {
      x: 50,
      y: 50,
      width: 200,
      height: 400
    };
  
    // Mapping des options
    const volumeMapping = {
      "demie": 0.25, // remplit 25% de la hauteur du verre
      "pinte": 0.50, // 50%
      "pichet": 0.75, // 75%
      "fut": 1.0     // 100%
    };
  
    // Pour un style sombre, on choisit des couleurs adaptées
    const beerColors = {
      "blonde": "#D2B48C",  // dorée mais adaptée
      "brune":  "#2E2E2E",  // noir profond
      "triple": "#8B4513",  // ambre profond
      "rousse": "#A0522D",  // roussâtre
      "blanche": "#EEE8AA"   // contraste léger sur fond sombre
    };
  
    const foamMapping = {
      "peu": 0.05,   // 5% de la hauteur du verre
      "moyen": 0.1,  // 10%
      "tres": 0.2    // 20%
    };
  
    let animationRequest;
    let simulationState = {};
    let simulationStartTime = null;
  
    startButton.addEventListener("click", () => {
      // Annule toute animation existante
      if (animationRequest) cancelAnimationFrame(animationRequest);
  
      // Récupération des paramètres sélectionnés
      const volumeKey = volumeSelect.value;
      const typeKey = typeSelect.value;
      const foamKey = foamSelect.value;
  
      // Calcul du niveau de bière en fonction du volume choisi
      const fillFraction = volumeMapping[volumeKey];  
      const beerFillHeight = glass.height * fillFraction;
      const beerTopY = glass.y + glass.height - beerFillHeight; // la bière remplit jusqu'ici
  
      // Couleur de la bière choisie
      const beerColor = beerColors[typeKey];
  
      // Calcul de la hauteur initiale de mousse (en pixels)
      const foamFraction = foamMapping[foamKey];
      const initialFoamHeight = glass.height * foamFraction;
      // La mousse se place juste au-dessus du niveau de bière
      const foamStartY = beerTopY - initialFoamHeight;
  
      // Taux de décroissance : 1px de mousse en moins par seconde
      const foamDecayRate = 1;  // en pixels/s
  
      // Stockage de tout dans l'état de simulation
      simulationState = {
        beerTopY,           // Y du haut de la bière dans le verre
        beerFillHeight,
        beerColor,
        initialFoamHeight,
        foamStartY,
        foamDecayRate,
        glass
      };
  
      // Réinitialisation du temps de départ
      simulationStartTime = null;
      // Lancer la boucle d’animation
      animationRequest = requestAnimationFrame(animate);
    });
  
    function animate(timestamp) {
      if (!simulationStartTime) simulationStartTime = timestamp;
      const elapsed = (timestamp - simulationStartTime) / 1000; // en secondes
  
      // Calcul de la hauteur actuelle de la mousse avec une décroissance linéaire
      const currentFoamHeight = Math.max(simulationState.initialFoamHeight - simulationState.foamDecayRate * elapsed, 0);
      const currentFoamY = simulationState.beerTopY - currentFoamHeight;
  
      // Effet de floating appliqué uniquement au contenu (bière, mousse, texte)
      const floatAmplitude = 8;   // décalage maximal en pixels
      const floatPeriod = 3000;   // période de l'oscillation (ms)
      const floatOffset = floatAmplitude * Math.sin((timestamp % floatPeriod) / floatPeriod * 2 * Math.PI);
  
      // Effacer le canvas avec un fond sombre
      ctx.fillStyle = "#111"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // --- Dessiner le verre fixe ---
      const g = simulationState.glass;
      let glassGradient = ctx.createLinearGradient(g.x, g.y, g.x + g.width, g.y + g.height);
      glassGradient.addColorStop(0, "#444");
      glassGradient.addColorStop(1, "#222");
      ctx.lineWidth = 4;
      ctx.strokeStyle = glassGradient;
      ctx.strokeRect(g.x, g.y, g.width, g.height);
  
      // Ombre du verre pour plus de relief
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 15;
      ctx.strokeRect(g.x, g.y, g.width, g.height);
      ctx.restore();
  
      // --- Dessiner la bière (avec floating) ---
      ctx.fillStyle = simulationState.beerColor;
      // La bière est dessinée de beerTopY + floatOffset jusqu'au bas du verre
      ctx.fillRect(g.x, simulationState.beerTopY + floatOffset, g.width, (g.y + g.height) - simulationState.beerTopY);
  
      // --- Dessiner la mousse (avec floating) ---
      if (currentFoamHeight > 0) {
        let foamGradient = ctx.createLinearGradient(g.x, currentFoamY + floatOffset, g.x, currentFoamY + currentFoamHeight + floatOffset);
        foamGradient.addColorStop(0, "rgba(230,230,230,0.95)");
        foamGradient.addColorStop(1, "rgba(230,230,230,0.50)");
        ctx.fillStyle = foamGradient;
        ctx.fillRect(g.x, currentFoamY + floatOffset, g.width, currentFoamHeight);
      }
      
      // --- Dessiner le texte "Guinness" avec animation de pulsation ---
      let textOpacity = 0.75 + 0.25 * Math.abs(Math.sin(timestamp / 500));
      ctx.globalAlpha = textOpacity;
      ctx.fillStyle = "#ddd";
      ctx.font = "bold 32px 'Roboto', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textX = g.x + g.width / 2;
      const textY = simulationState.beerTopY + ((g.y + g.height) - simulationState.beerTopY) / 2 + floatOffset;
      ctx.fillText("Guinness", textX, textY);
      ctx.globalAlpha = 1;
  
      // Affichage optionnel du temps écoulé dans le coin supérieur gauche du verre (floating si souhaité)
      ctx.fillStyle = "#ccc";
      ctx.font = "14px Arial";
      ctx.textAlign = "left";
      ctx.fillText("Temps : " + elapsed.toFixed(1) + " s", g.x, g.y - 10);
  
      // Continuer l'animation
      animationRequest = requestAnimationFrame(animate);
    }
  });
  