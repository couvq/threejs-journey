import GUI from "lil-gui";
import * as THREE from "three";
import {
  ConeGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshToonMaterial,
  NearestFilter,
  TextureLoader,
  TorusGeometry,
  TorusKnotGeometry,
} from "three";

/**
 * Debug
 */
const gui = new GUI({ closeFolders: true }).close();

const parameters = {
  materialColor: "#0ab6f0",
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
gradientTexture.magFilter = NearestFilter;

const material = new MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const objectsDistance = 4;
const mesh1 = new Mesh(new TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new Mesh(new ConeGeometry(1, 2, 32), material);
const mesh3 = new Mesh(new TorusKnotGeometry(0.8, 0.35, 100, 16), material);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

const directionalLight = new DirectionalLight("#ffffff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

gui
  .addColor(parameters, "materialColor")
  .onChange(() => material.color.set(parameters.materialColor));

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
const cameraGroup = new Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Scroll
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

// Cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1;
    mesh.rotation.y = elapsedTime * 0.12;
  }

  // move camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;
  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * .02;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * .02;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
