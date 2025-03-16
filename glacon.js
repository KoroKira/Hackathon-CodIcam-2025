// glacon.js

document.addEventListener('DOMContentLoaded', init);

let scene, camera, renderer;
let cube, puddle;
let simulationInterval;
let stats = { timeDisplay: null, phaseDisplay: null, massDisplay: null, temperatureDisplay: null };

function init() {
  // Récupération des éléments UI pour les statistiques
  stats.timeDisplay = document.getElementById('timeDisplay');
  stats.phaseDisplay = document.getElementById('phaseDisplay');
  stats.massDisplay = document.getElementById('massDisplay');
  stats.temperatureDisplay = document.getElementById('temperatureDisplay');

  // Création de la scène Three.js
  scene = new THREE.Scene();

  // Création d'une caméra orthographique pour une vue isométrique
  let aspect = window.innerWidth / window.innerHeight;
  const d = 4;
  camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(10, 10, 10);
  camera.lookAt(scene.position);

  // Création du renderer et insertion dans le conteneur de simulation
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const container = document.getElementById('simulation-container');
  container.appendChild(renderer.domElement);

  // Ajout d'une lumière ambiante et directionnelle
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Création du glaçon : un cube avec pivot en bas pour rester ancré au sol lors du rétrécissement
  const initialMeshCubeSize = 1; // en mètres
  let cubeGeometry = new THREE.BoxGeometry(initialMeshCubeSize, initialMeshCubeSize, initialMeshCubeSize);
  // Décalage pour que la base soit à y=0
  cubeGeometry.translate(0, initialMeshCubeSize / 2, 0);
  let cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0xadd8e6,
    transparent: true,
    opacity: 1,
    shininess: 100
  });
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(0, 0, 0);
  scene.add(cube);

  // Création de la flaque d'eau (puddle) : on utilise une CircleGeometry sur le sol (plan XZ)
  const puddleGeometry = new THREE.CircleGeometry(1, 32);
  const puddleMaterial = new THREE.MeshBasicMaterial({
    color: 0x6699ff,
    opacity: 0.7,
    transparent: true,
    side: THREE.DoubleSide
  });
  puddle = new THREE.Mesh(puddleGeometry, puddleMaterial);
  // Rotation pour placer le cercle horizontalement
  puddle.rotation.x = -Math.PI / 2;
  // Légère translation pour éviter le z-fighting
  puddle.position.y = 0.001;
  // Initialement, la flaque a un rayon quasi nul
  puddle.scale.set(0.001, 1, 0.001);
  scene.add(puddle);

  // Écouteur sur le bouton de démarrage
  document.getElementById('startButton').addEventListener('click', startSimulation);

  // Lancement de la boucle de rendu
  animate();

  // Ajustement lors du redimensionnement de la fenêtre
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  let aspect = window.innerWidth / window.innerHeight;
  const d = 4;
  camera.left = -d * aspect;
  camera.right = d * aspect;
  camera.top = d;
  camera.bottom = -d;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// --------------------------------------------
// Simulation physique
// --------------------------------------------

// Constantes physiques réelles
const cIce = 2100;          // Capacité thermique de la glace [J/(kg·K)]
const Lfusion = 334000;     // Chaleur latente de fusion [J/kg]
const densityIce = 920;     // Masse volumique de la glace [kg/m³]
const densityWater = 1000;  // Masse volumique de l'eau [kg/m³]
const T_initial = -10;      // Température initiale du glaçon (°C)
const puddleDepth = 0.005;  // Épaisseur supposée de la flaque en mètres

// Objet pour stocker l'état de simulation
let simulationState = {};

function startSimulation() {
  // Arrêter une simulation existante si nécessaire
  if (simulationInterval) clearInterval(simulationInterval);

  // Récupération des paramètres utilisateur depuis l'interface
  const mass0 = parseFloat(document.getElementById('massInput').value);
  const ambientT = parseFloat(document.getElementById('tempInput').value);
  const accelFactor = parseFloat(document.getElementById('accelInput').value);
  const windSpeed = parseFloat(document.getElementById('windInput').value);
  const convectionCoef = parseFloat(document.getElementById('convectionInput').value);

  if (ambientT <= 0) {
    alert("La température ambiante doit être supérieure à 0°C pour permettre la fusion.");
    return;
  }

  // Exemple simple : l'effet du vent augmente le coefficient de convection
  const windFactor = 5; // Constante arbitraire
  const h_effective = convectionCoef + windFactor * windSpeed;

  // Initialisation de l'état de simulation
  simulationState = {
    mass0: mass0,
    ambientT: ambientT,
    accelFactor: accelFactor,
    currentMass: mass0,
    currentT: T_initial,
    elapsedSimTime: 0,
    phase: "Chauffage",
    initialSide: Math.cbrt(mass0 / densityIce) // côté initial en m
  };

  // Calcul de la surface initiale (pour le transfert de chaleur en phase de chauffage)
  simulationState.A0 = 6 * Math.pow(simulationState.initialSide, 2);

  // Définir les intervalles de temps
  const dtReal = 0.1;                // Pas de temps réel (en secondes)
  const dtSim = dtReal * accelFactor; // Pas de temps simulé (accéléré)

  // Démarrage de la boucle de simulation
  simulationInterval = setInterval(() => {
    simulationState.elapsedSimTime += dtSim;

    if (simulationState.phase === "Chauffage") {
      // Phase de chauffage : augmenter la température de T_initial à 0°C
      // dT/dt = (h_effective * A0 * (ambientT - T)) / (mass0 * cIce)
      let dT = (h_effective * simulationState.A0 * (simulationState.ambientT - simulationState.currentT)) / (mass0 * cIce) * dtSim;
      simulationState.currentT += dT;
      if (simulationState.currentT >= 0) {
        simulationState.currentT = 0;
        simulationState.phase = "Fusion";
      }
    } else if (simulationState.phase === "Fusion") {
      // Phase de fusion : la température reste à 0°C et le glaçon perd de la masse
      let currentSide = Math.cbrt(simulationState.currentMass / densityIce);
      let currentArea = 6 * Math.pow(currentSide, 2);
      // dm/dt = - (h_effective * A(m) * ambientT) / Lfusion
      let dm = (h_effective * currentArea * simulationState.ambientT / Lfusion) * dtSim;
      simulationState.currentMass -= dm;
      if (simulationState.currentMass < 0) simulationState.currentMass = 0;
    }

    // Mise à jour visuelle du glaçon : recalcul du côté selon la masse restante
    let newSide = Math.cbrt(simulationState.currentMass / densityIce);
    let scale = newSide / simulationState.initialSide;
    cube.scale.set(scale, scale, scale);
    // On peut choisir de garder une opacité fixe ou de la modifier (ici, on garde opaque)
    cube.material.opacity = 1;

    // Mise à jour de la flaque d'eau (puddle)
    // Masse fondue = masse initiale - masse actuelle
    let meltedMass = mass0 - simulationState.currentMass;
    // Volume d'eau fondu (m³) = masse fondue / densité de l'eau
    let meltedVolume = meltedMass / densityWater;
    // Aire de la flaque (m²) = volume / puddleDepth (puddleDepth supposée constante)
    let puddleArea = meltedVolume / puddleDepth;
    let puddleRadius = Math.sqrt(puddleArea / Math.PI);
    // La géométrie Circle a un rayon de 1 ; on adapte l'échelle pour obtenir le rayon voulu
    puddle.scale.set(puddleRadius, 1, puddleRadius);

    // Mise à jour des statistiques dans l'interface
    stats.timeDisplay.textContent = "Temps écoulé : " + simulationState.elapsedSimTime.toFixed(1) + " s";
    stats.phaseDisplay.textContent = "Phase : " + simulationState.phase;
    stats.massDisplay.textContent = "Masse restante : " + simulationState.currentMass.toFixed(3) + " kg";
    stats.temperatureDisplay.textContent = "Température du glaçon : " + simulationState.currentT.toFixed(1) + " °C";

    // Fin de la simulation lorsque le glaçon est complètement fondu
    if (simulationState.currentMass <= 0) {
      clearInterval(simulationInterval);
      stats.phaseDisplay.textContent = "Phase : Glaçon complètement fondu";
    }
  }, dtReal * 1000);
}
