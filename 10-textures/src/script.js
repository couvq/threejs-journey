import * as THREE from "three";
import {
    LinearFilter,
  LinearMipmapNearestFilter,
  LoadingManager,
  NearestFilter,
  NearestMipMapLinearFilter,
  NearestMipMapNearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */
const loadingManager = new LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onProgress = (url, loaded, total) => {
  console.log(`loaded ${loaded} out of ${total}`);
};
loadingManager.onLoad = () => {
  console.log("loaded!");
};
// one texture loader can load any # of textures
const textureLoader = new TextureLoader(loadingManager);
const colorTexture = textureLoader.load("textures/minecraft.png");
const alphaTexture = textureLoader.load("textures/door/alpha.jpg");
const heightTexture = textureLoader.load("textures/door/height.jpg");
const normalTexture = textureLoader.load("textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg");
colorTexture.colorSpace = SRGBColorSpace;

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = RepeatWrapping
// colorTexture.wrapT = RepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.center.x = 0.5
// colorTexture.center.setY(0.5)
// colorTexture.rotation = Math.PI / 4

/**
 * Mipmapping is a technique that consists of creating half a smaller version of a texture again and again until we get a 1x1 texture
 *
 * all those texture variants are sent to the GPU, and the GPU will choose the most appropriate version of the texture
 * 
 * You don't have to do this yourself, it is handled for you when you create textures
 * 
 * minfilters - when the image for the texture is too big
 * magFilters - when the image for the texture is too small
 * 
 * ** NearestFilter is cheaper than the other ones and if the result is fine 
 *    with you just use it 
 * 
 * if using NearestFilter on minFilter, we don't need mipmaps so deactive mipmaps generation
 * 
 * smaller textures on the gpu is better, we'll talk about this later
 * 
 * when preparing textures, keep in mind 3 crucial elements:
 *  1. the weight
 *  2. the size (or resolution)
 *  3. the data
 */
 colorTexture.generateMipmaps = false
colorTexture.minFilter = NearestFilter
colorTexture.magFilter = NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;
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
