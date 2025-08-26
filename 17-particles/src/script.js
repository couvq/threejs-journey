import GUI from "lil-gui";
import * as THREE from "three";
import { BoxGeometry, BufferAttribute, BufferGeometry, Color, Mesh, MeshBasicMaterial, Points, PointsMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Particles
 */
const particlesGeometry = new BufferGeometry()
const count = 5000 // how many partices we want to represent
const positions = new Float32Array(count * 3) // multiplied by three because each grouping of 3 in the array represents x, y, z coordinates
for(let i = 0 ; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10 // random position (x, y, z) between -5 & 5
}
particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))
const particlesMaterial = new PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: new Color('#ff88cc'),
  alphaMap: particleTexture,
  transparent: true,
  // alphaTest: 0.001,
  // depthTest: false // not great if other objects in your scene, was able to see particles behind a cube I added
  depthWrite: false
});
const particles = new Points(particlesGeometry, particlesMaterial)
scene.add(particles)

const cube = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
scene.add(cube)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
