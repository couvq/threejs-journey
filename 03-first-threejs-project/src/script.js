import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

// canvas
const canvas = document.querySelector("canvas.webgl");

// scene
const scene = new Scene();

// object
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: 0xff0000 });
const mesh = new Mesh(geometry, material);

scene.add(mesh);

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.setZ(3)
camera.position.setY(3)
camera.position.setX(3)
camera.lookAt(mesh.position)
scene.add(camera);

// renderer
const renderer = new WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

