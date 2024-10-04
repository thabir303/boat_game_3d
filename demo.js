// import './style.css';

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { Water } from 'three/examples/jsm/objects/Water.js';
// import { Sky } from 'three/examples/jsm/objects/Sky.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// let camera, scene, renderer;
// let controls, water, sun;
// let gameStarted = false;
// const loader = new GLTFLoader();
// let score = 0;
// let timeLeft = 60; // Timer for 60 seconds

// // Cat images for smile and cry
// const catImageElement = document.createElement('img');
// catImageElement.style.position = 'absolute';
// catImageElement.style.top = '50px';
// catImageElement.style.left = '50px';
// catImageElement.style.width = '100px';
// catImageElement.style.height = '100px';
// catImageElement.src = 'assets/Smile.png'; // Set default cat image (smiling)
// document.body.appendChild(catImageElement);

// // Update the cat image based on collision
// function updateCatImage(isPositive) {
//   if (isPositive) {
//     catImageElement.src = 'assets/Smile.png'; // Path to smile image
//   } else {
//     catImageElement.src = 'assets/Crying.png'; // Path to crying image
//   }
// }

// // Create and display the timer element
// const timerElement = document.createElement('div');
// timerElement.id = 'timer';
// timerElement.style.position = 'absolute';
// timerElement.style.top = '10px';
// timerElement.style.right = '10px';
// timerElement.style.color = 'white';
// timerElement.style.fontSize = '24px';
// document.body.appendChild(timerElement);

// function random(min, max) {
//   return Math.random() * (max - min) + min;
// }

// function getRandomColor() {
//   const r = Math.random();
//   const g = Math.random();
//   const b = Math.random();
//   return new THREE.Color(r, g, b);
// }

// class Boat {
//   constructor() {
//     loader.load('assets/boat/scene.gltf', (gltf) => {
//       scene.add(gltf.scene);
//       gltf.scene.scale.set(3, 3, 3);
//       gltf.scene.position.set(0, 13, 0);
//       gltf.scene.rotation.y = 1.5;

//       this.boat = gltf.scene;
//       this.speed = {
//         vel: 0,
//         rot: 0,
//       };
//     });
//   }

//   stop() {
//     this.speed.vel = 0;
//     this.speed.rot = 0;
//   }

//   update() {
//     if (this.boat) {
//       this.boat.rotation.y += this.speed.rot;
//       this.boat.translateX(this.speed.vel);
//     }
//   }
// }

// const boat = new Boat();

// class FloatingObject {
//   constructor(_scene, isPositive) {
//     scene.add(_scene);
//     _scene.scale.set(1.5, 1.5, 1.5);
    
//     // Adjust the spawn range to be closer to the boat
//     const spawnRange = 100;
//     _scene.position.set(
//       random(-spawnRange, spawnRange),
//       -0.5,
//       random(-spawnRange, spawnRange)
//     );

//     const color = isPositive ? new THREE.Color(0, 1, 0) : new THREE.Color(1, 0, 0);

//     _scene.traverse((child) => {
//       if (child.isMesh) {
//         child.material = new THREE.MeshPhongMaterial({
//           color: color,
//           emissive: color.multiplyScalar(0.3),
//           shininess: 30,
//         });
//       }
//     });

//     this.object = _scene;
//     this.isPositive = isPositive;
//   }
// }

// async function loadModel(url) {
//   return new Promise((resolve, reject) => {
//     loader.load(url, (gltf) => {
//       resolve(gltf.scene);
//     });
//   });
// }

// let objectModel = null;
// async function createFloatingObject() {
//   if (!objectModel) {
//     objectModel = await loadModel('assets/trash/scene.gltf');
//   }
//   return new FloatingObject(objectModel.clone(), Math.random() > 0.5);
// }

// let floatingObjects = [];
// const OBJECT_COUNT = 200; // Reduced from 500 to make the game area less crowded
// init();
// animate();

// function createStartScreen() {
//   const startScreen = document.createElement('div');
//   startScreen.id = 'start-screen';
//   startScreen.style.position = 'absolute';
//   startScreen.style.top = '0';
//   startScreen.style.left = '0';
//   startScreen.style.width = '100%';
//   startScreen.style.height = '100%';
//   startScreen.style.background = 'rgba(0, 0, 0, 0.7)';
//   startScreen.style.display = 'flex';
//   startScreen.style.justifyContent = 'center';
//   startScreen.style.alignItems = 'center';
//   startScreen.style.color = 'white';
//   startScreen.style.flexDirection = 'column';
//   startScreen.style.fontSize = '30px';
//   startScreen.style.zIndex = '999';

//   const title = document.createElement('div');
//   title.textContent = 'Welcome to the Boat Adventure!';
//   startScreen.appendChild(title);

//   const instructions = document.createElement('div');
//   instructions.textContent = 'Use Arrow keys to move the boat. Collect green objects, avoid red ones!';
//   instructions.style.marginTop = '20px';
//   instructions.style.fontSize = '20px';
//   startScreen.appendChild(instructions);

//   const startButton = document.createElement('button');
//   startButton.textContent = 'Start Game';
//   startButton.style.padding = '10px 20px';
//   startButton.style.fontSize = '20px';
//   startButton.style.cursor = 'pointer';
//   startButton.style.marginTop = '30px';
//   startScreen.appendChild(startButton);

//   document.body.appendChild(startScreen);

//   startButton.addEventListener('click', () => {
//     document.body.removeChild(startScreen);
//     gameStarted = true;
//     startTimer();
//   });
// }

// createStartScreen();

// async function init() {
//   renderer = new THREE.WebGLRenderer();
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   document.body.appendChild(renderer.domElement);

//   scene = new THREE.Scene();

//   camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
//   camera.position.set(30, 30, 100);

//   sun = new THREE.Vector3();

//   const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

//   water = new Water(waterGeometry, {
//     textureWidth: 512,
//     textureHeight: 512,
//     waterNormals: new THREE.TextureLoader().load('assets/waternormals.jpg', function (texture) {
//       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     }),
//     sunDirection: new THREE.Vector3(),
//     sunColor: 0xffffff,
//     waterColor: 0x001e0f,
//     distortionScale: 3.7,
//     fog: scene.fog !== undefined,
//   });

//   water.rotation.x = -Math.PI / 2;
//   scene.add(water);

//   const sky = new Sky();
//   sky.scale.setScalar(10000);
//   scene.add(sky);

//   const skyUniforms = sky.material.uniforms;

//   skyUniforms['turbidity'].value = 10;
//   skyUniforms['rayleigh'].value = 2;
//   skyUniforms['mieCoefficient'].value = 0.005;
//   skyUniforms['mieDirectionalG'].value = 0.8;

//   const parameters = {
//     elevation: 2,
//     azimuth: 180,
//   };

//   const pmremGenerator = new THREE.PMREMGenerator(renderer);

//   function updateSun() {
//     const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
//     const theta = THREE.MathUtils.degToRad(parameters.azimuth);

//     sun.setFromSphericalCoords(1, phi, theta);

//     sky.material.uniforms['sunPosition'].value.copy(sun);
//     water.material.uniforms['sunDirection'].value.copy(sun).normalize();

//     scene.environment = pmremGenerator.fromScene(sky).texture;
//   }

//   updateSun();

//   controls = new OrbitControls(camera, renderer.domElement);
//   controls.maxPolarAngle = Math.PI * 0.495;
//   controls.target.set(0, 10, 0);
//   controls.minDistance = 40.0;
//   controls.maxDistance = 200.0;
//   controls.update();

//   for (let i = 0; i < OBJECT_COUNT; i++) {
//     const object = await createFloatingObject();
//     floatingObjects.push(object);
//   }

//   const scoreElement = document.createElement('div');
//   scoreElement.id = 'score';
//   scoreElement.style.position = 'absolute';
//   scoreElement.style.top = '10px';
//   scoreElement.style.left = '10px';
//   scoreElement.style.color = 'white';
//   scoreElement.style.fontSize = '24px';
//   document.body.appendChild(scoreElement);

//   window.addEventListener('resize', onWindowResize);

//   window.addEventListener('keydown', function (e) {
//     if (gameStarted) {
//       if (e.key == 'ArrowUp') {
//         boat.speed.vel = 1;
//       }
//       if (e.key == 'ArrowDown') {
//         boat.speed.vel = -1;
//       }
//       if (e.key == 'ArrowRight') {
//         boat.speed.rot = -0.1;
//       }
//       if (e.key == 'ArrowLeft') {
//         boat.speed.rot = 0.1;
//       }
//     }
//   });
//   window.addEventListener('keyup', function (e) {
//     boat.stop();
//   });
// }

// // Timer function to count down from 60 seconds
// function startTimer() {
//   const countdown = setInterval(() => {
//     timeLeft--;
//     updateTimerDisplay();

//     if (timeLeft <= 0) {
//       clearInterval(countdown);
//       endGame();
//     }
//   }, 1000);
// }

// function updateTimerDisplay() {
//   timerElement.textContent = `Time: ${timeLeft}s`;
// }

// // Function to end the game
// function endGame() {
//   gameStarted = false;

//   const endScreen = document.createElement('div');
//   endScreen.style.position = 'absolute';
//   endScreen.style.top = '0';
//   endScreen.style.left = '0';
//   endScreen.style.width = '100%';
//   endScreen.style.height = '100%';
//   endScreen.style.background = 'rgba(0, 0, 0, 0.7)';
//   endScreen.style.display = 'flex';
//   endScreen.style.justifyContent = 'center';
//   endScreen.style.alignItems = 'center';
//   endScreen.style.color = 'white';
//   endScreen.style.fontSize = '30px';
//   endScreen.style.zIndex = '999';

//   const message = document.createElement('div');
//   message.textContent = `Game Over! Your score: ${score}`;
//   endScreen.appendChild(message);

//   document.body.appendChild(endScreen);
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function isColliding(obj1, obj2) {
//   return (
//     Math.abs(obj1.position.x - obj2.position.x) < 15 &&
//     Math.abs(obj1.position.z - obj2.position.z) < 15
//   );
// }

// function checkCollisions() {
//   if (boat.boat) {
//     floatingObjects.forEach((object, index) => {
//       if (object.object) {
//         if (isColliding(boat.boat, object.object)) {
//           scene.remove(object.object);
//           floatingObjects.splice(index, 1);

//           if (object.isPositive) {
//             score += 10;
//             updateCatImage(true); // Cat smiles when collecting green objects
//           } else {
//             score -= 5;
//             updateCatImage(false); // Cat cries when touching red objects
//           }

//           updateScoreDisplay();
          
//           // Spawn a new object to replace the collected one
//           createFloatingObject().then(newObject => {
//             floatingObjects.push(newObject);
//           });
//         }
//       }
//     });
//   }
// }

// function updateScoreDisplay() {
//   const scoreElement = document.getElementById('score');
//   scoreElement.textContent = `Score: ${score}`;
// }

// function animate() {
//   requestAnimationFrame(animate);
//   render();
//   if (gameStarted) {
//     boat.update();
//     checkCollisions();
//   }
// }

// function render() {
//   water.material.uniforms['time'].value += 1.0 / 60.0;
//   renderer.render(scene, camera);
// }