import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

window.addEventListener('dblclick', () => {
    const fullscreenEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenEl) {
        canvas.requestFullscreen ? canvas.requestFullscreen() : canvas.webkitRequestFullscreen();
    } else {
        document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
    }
});

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const moonTexture = textureLoader.load('/textures/moon.jpeg');
const sunTexture = textureLoader.load('/textures/sun.jpeg');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Cursor
const cursor = {
    x: 0,
    y: 0,
};
window.addEventListener('mousemove', e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    // console.log(cursor);
});

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x000000 );

// Object
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunObject = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    sunMaterial
);
sunMaterial.transparent = true;
sunObject.material.opacity = 0;

const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moonObject = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    moonMaterial
);
moonMaterial.transparent = true;
moonObject.material.opacity = 0;

scene.add(sunObject);


// for (let i = 0; i < 1000; i++) {
//     const starObject = new THREE.Mesh(
//         new THREE.SphereGeometry(0.01, 32, 32),
//         new THREE.MeshBasicMaterial()
//     );
//     starObject.position.y = getRandomArbitrary(0, 10);
//     starObject.position.x = getRandomArbitrary(0, 10);
//     starObject.position.z = getRandomArbitrary(0, 10);
//     scene.add(starObject);
// }

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// function addSphere(){
//
//     // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position.
//     for ( var z= 0; z < 100; z++) {
//
//         // Make a sphere (exactly the same as before).
//         var geometry   = new THREE.SphereGeometry(0.01, 32, 32)
//         var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
//         var sphere = new THREE.Mesh(geometry, material)
//
//         // This time we give the sphere random x and y positions between -500 and 500
//         sphere.position.x = getRandomArbitrary(0, 5);
//         sphere.position.y = getRandomArbitrary(0, 5);
//
//         // Then set the z position to where it is in the loop (distance of camera)
//         sphere.position.z = getRandomArbitrary(0, 5);
//
//         // scale it up a bit
//         // sphere.scale.x = sphere.scale.y = 2;
//
//         //add the sphere to the scene
//         scene.add( sphere );
//
//         //finally push it to the stars array
//         stars.push(sphere);
//     }
// }


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 50)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 3
camera.rotation.y = Math.PI;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// Animate
const clock = new THREE.Clock();

let secs = 0;

let currentObject = sunObject;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    currentObject.rotation.y = elapsedTime / 10;
    if (secs < 500) {
        currentObject.material.opacity = secs / 100;
        secs++;
        console.log('secs', secs);
    } else {
        currentObject.material.opacity = 0;
        scene.remove(currentObject);
        currentObject = currentObject === sunObject ? moonObject : sunObject;
        scene.add(currentObject);
        secs = 0;
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();
addSphere();