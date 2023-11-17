import * as THREE from 'three'
import { AxesHelper, BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

// // Position
// // mesh.position.x = 0.7
// // mesh.position.y = -0.6
// // mesh.position.z = 1
// mesh.position.set(0.7, -0.6, 1)

// scene.add(mesh)

// // Scale
// mesh.scale.set(2, 0.5, 1)

// // Rotate objects - updating one will automatically update the other (rotation & quaternion properties)
// /**
//  * rotation 
//  * 
//  * also has x, y, and z properties but it's a Euler
//  * 
//  * when you change the x, y, and z properties you can imagine putting a stick through your object's
//  * center in the axis's direction and then rotating that object on that stick
//  */
// //expressed in radians, can reorder rotations to avoid weird "gimbal locks"
// mesh.rotation.reorder('YXZ')
// mesh.rotation.x = Math.PI * 0.5
// mesh.rotation.y = Math.PI * 0.5

/**
 * Euler is easy to understand but this axis order can be problematic
 * This is why most engines and 3D softwares use Quaternion
 */

// Quaternion
/**
 * Quaternion also expresses a rotation, but in a more mathematical way
 * We will cover quaternions in this lesson but remember that the quaternion
 * updates when you change the rotation, and vice versa
 */

/**
 * Combining transformations
 * 
 * You can combine position, rotation (or quaternion), and scale in any order
 */

/**
 * Scene graph
 * 
 * You can put objects inside groups and use position, rotation (or quaternion),
 * and scale on thos groups. To do that, use the Group class
 */
const group = new Group()
scene.add(group)

const cube1 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 'red' })
)
const cube2 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 'orange' })
)
cube2.position.setX(-2)
group.add(cube1, cube2)
group.position.setX(1)
group.scale.setY(1.5)
group.rotateZ(Math.PI * -0.5)


// Axes helper
const axesHelper = new AxesHelper(100000)
scene.add(axesHelper)


/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.setZ(3)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
