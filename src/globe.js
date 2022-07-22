import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class ThreeJSGlobe {
    secs = 0;
    sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    // cursor = {
    //     x: 0,
    //     y: 0,
    // };

    constructor() {
        this.setupEventListeners();
        this.setupTextures();
        this.setupCanvas();
        this.setupCursor();
        this.setupScene();
        this.createObjects();
        this.setupCamera();
        this.setupControls();
        this.setupRenderer();
        this.clock = new THREE.Clock();

        this.animate();
    }
    setupEventListeners() {
        const that = this;
        window.addEventListener('resize', () =>
        {
            // Update sizes
            that.sizes.width = window.innerWidth
            that.sizes.height = window.innerHeight

            // Update camera
            that.camera.aspect = that.sizes.width / that.sizes.height
            that.camera.updateProjectionMatrix()

            // Update renderer
            that.renderer.setSize(that.sizes.width, that.sizes.height)
            that.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        });

        window.addEventListener('dblclick', () => {
            const fullscreenEl = document.fullscreenElement || document.webkitFullscreenElement;
            if (!fullscreenEl) {
                canvas.requestFullscreen ? canvas.requestFullscreen() : canvas.webkitRequestFullscreen();
            } else {
                document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
            }
        });
    }
    setupTextures() {
        const loadingManager = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(loadingManager);
        this.moonTexture = textureLoader.load('/textures/moon.jpeg');
        this.sunTexture = textureLoader.load('/textures/sun.jpeg');
    }
    setupCanvas() {
        this.canvas = document.querySelector('canvas.webgl')
    }
    setupCursor() {
        // window.addEventListener('mousemove', e => {
        //     cursor.x = e.clientX;
        //     cursor.y = e.clientY;
        // });
    }
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
    }
    createObjects() {
        const sunMaterial = new THREE.MeshBasicMaterial({ map: this.sunTexture });
        this.sunObject = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            sunMaterial
        );
        sunMaterial.transparent = true;
        this.sunObject.material.opacity = 0;

        const moonMaterial = new THREE.MeshBasicMaterial({ map: this.moonTexture });
        this.moonObject = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            moonMaterial
        );
        moonMaterial.transparent = true;
        this.moonObject.material.opacity = 0;

        this.scene.add(this.sunObject);
        this.currentObject = this.sunObject;
    }
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 50)
        this.camera.position.x = 1
        this.camera.position.y = 1
        this.camera.position.z = 3
        this.camera.rotation.y = Math.PI;
        this.scene.add(this.camera)
    }
    setupControls() {
        const controls = new OrbitControls(this.camera, this.canvas)
        controls.enableDamping = true
    }
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
    }
    animate() {
        const elapsedTime = this.clock.getElapsedTime();

        // Update objects
        this.currentObject.rotation.y = elapsedTime / 10;
        if (this.secs < 500) {
            this.currentObject.material.opacity = this.secs / 100;
            this.secs++;
        } else {
            this.currentObject.material.opacity = 0;
            this.scene.remove(this.currentObject);
            this.currentObject = this.currentObject === this.sunObject ? this.moonObject : this.sunObject;
            this.scene.add(this.currentObject);
            this.secs = 0;
        }


        // Render
        this.renderer.render(this.scene, this.camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(() => this.animate(this));
    }
}