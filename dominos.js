// Fonction pour gérer les cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Initialisation du compteur de chutes
let fallCount = parseInt(getCookie('fallCount')) || 0;
document.getElementById('fall-count').textContent = fallCount;

// Réinitialisation du domino
document.getElementById('reset-button').addEventListener('click', () => {
    location.reload(); // Recharge la page
});

// Initialisation de la scène Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Sol
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Domino
const dominoGeometry = new THREE.BoxGeometry(0.2, 1, 0.5);
const dominoMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const domino = new THREE.Mesh(dominoGeometry, dominoMaterial);
domino.position.set(0, 0.5, 0);
domino.castShadow = true;
scene.add(domino);

// Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

camera.position.set(3, 2, 5);
camera.lookAt(0, 0.5, 0);

// Variables physiques
let isFalling = false;
let currentAngle = 0;
let angularVelocity = 0;
const gravity = 9.8;
const pivotHeight = 0.5;
const damping = 0.2;
const staticFriction = 0.01;

let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (isFalling) {
        const torque = gravity * pivotHeight * Math.sin(currentAngle);
        const angularAcceleration = torque / (pivotHeight * pivotHeight);
        angularVelocity += angularAcceleration * delta;
        currentAngle += angularVelocity * delta;

        if (currentAngle <= -Math.PI / 2) {
            currentAngle = -Math.PI / 2;
            angularVelocity *= -damping;

            if (Math.abs(angularVelocity) < staticFriction) {
                angularVelocity = 0;
                isFalling = false;

                // Incrémenter le compteur de chutes
                fallCount++;
                document.getElementById('fall-count').textContent = fallCount;
                setCookie('fallCount', fallCount, 7); // Sauvegarder dans un cookie pour 7 jours
            }
        }

        domino.rotation.z = currentAngle;
        domino.position.y = pivotHeight * Math.cos(currentAngle);
    }

    renderer.render(scene, camera);
}

document.addEventListener('click', () => {
    if (!isFalling) {
        isFalling = true;
        angularVelocity = -0.1;
    }
});

animate();