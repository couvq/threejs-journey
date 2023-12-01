import GUI from "lil-gui";
import * as THREE from "three";
import {
  AmbientLight,
  EquirectangularReflectionMapping,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

doorColorTexture.colorSpace = SRGBColorSpace;
matcapTexture.colorSpace = SRGBColorSpace;

/**
 * Objects
 */
// MeshBasicMaterial - don't need a light
// const material = new MeshBasicMaterial();
// material.map = doorColorTexture
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
//

// MeshNormalMaterial
// "Normals" are information encoded in each vertex that contains information of the outside of the face
// const material = new MeshNormalMaterial()
// material.flatShading = true

// MeshMatcapMaterial - kind of like "faking" lights/shadows without an actual light
// const material = new MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshDepthMaterial
// color the geometry in white if it is near the camera, black if it is far
// const material = new MeshDepthMaterial()

// MeshLambertMaterial
// first material that requires lights
// const material = new MeshLambertMaterial()

// MeshPhongMaterial - reflects but not really realistic
// const material = new MeshPhongMaterial()
// material.shininess = 100
// material.specular = new Color(0x1188ff)

// MeshToonMaterial - cartoonish style
// const material = new MeshToonMaterial()
// gradientTexture.minFilter = NearestFilter
// gradientTexture.magFilter = NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// // MeshStandardMaterial
// const material = new MeshStandardMaterial();
// material.metalness = 0.7;
// material.roughness = 0.2;
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// // material.displacementMap = doorHeightTexture
// // material.displacementScale = 0.2
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// MeshPhysicalMaterial
const material = new MeshPhysicalMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.2
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.transparent = true;
material.alphaMap = doorAlphaTexture;
material.clearcoat = 1;
material.clearcoatRoughness = 0;
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(1, 1, 1)

// gui.add(material, 'sheen').min(0).max(1).step(0.0001)
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
// gui.addColor(material, 'sheenColor')

gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

material.iridescence = 1;
material.iridescenceIOR = 1;
material.iridescenceThicknessRange = [100, 800];
gui.add(material, 'iridescence').min(0).max(1).step(0.0001)

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

const sphere = new Mesh(new SphereGeometry(0.5, 16, 16), material);
sphere.position.x = -1.5;

const plane = new Mesh(new PlaneGeometry(1, 1), material);

const torus = new Mesh(new TorusGeometry(0.3, 0.2, 16, 32), material);
torus.position.x = 1.5;
gui.add(torus.position, "z").min(-100).max(100).step(0.01);

scene.add(sphere, plane, torus);

/**
 * Lights
 */
const ambientLight = new AmbientLight();
scene.add(ambientLight);

const pointLight = new PointLight(0xffffff, 30);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.15 * elapsedTime;
  plane.rotation.x = -0.15 * elapsedTime;
  torus.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
