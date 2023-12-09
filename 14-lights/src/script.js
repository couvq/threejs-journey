import GUI from "lil-gui";
import * as THREE from "three";
import { SpotLight, SpotLightHelper } from "three";
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
 * Lights
 */
// rays come from every direction, uniformly
// we can use the ambient light to simulate light bouncing
// const ambientLight = new AmbientLight();
// scene.add(ambientLight);
// gui.add(ambientLight, "intensity").min(0).max(10).step(0.01);

// like the sun, if we use the helper we see thel light comes from the top
// looks like whatever position it is it just points at the center by default
// const directionalLight = new DirectionalLight()
// directionalLight.position.set(1, 0.25, 0)
// const directionalLightHelper = new DirectionalLightHelper(directionalLight, 5)
// scene.add(directionalLight, directionalLightHelper)

// this one looks like it gives me a top light and a bottom light
// const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.9)
// const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 5)
// scene.add(hemisphereLight, hemisphereLightHelper)

// like a candle, illuminates in every direction
// const pointLight = new PointLight(0xff9000, 1.5)
// const pointLightHelper = new PointLightHelper(pointLight)
// scene.add(pointLight, pointLightHelper)

// like photographer's lights
// const rectAreaLight = new RectAreaLight(0x4e00ff, 6, 1, 1)
// rectAreaLight.position.set(-1.5, 1, 1.5)
// rectAreaLight.lookAt(new Vector3(0, 0, 0))
// scene.add(rectAreaLight)

// like a flashlight
const spotLight = new SpotLight('orange', 4.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 3, 5)
spotLight.castShadow = true
const spotLightHelper = new SpotLightHelper(spotLight)
scene.add(spotLight, spotLightHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true
sphere.receiveShadow = true
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
cube.receiveShadow = true
cube.castShadow = true

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.castShadow = true
torus.receiveShadow = true
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.receiveShadow = true
plane.castShadow = true
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
