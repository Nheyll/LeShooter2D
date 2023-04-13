import * as THREE from 'three';
import { container1Element, SCENE_HEIGHT, SCENE_WIDTH } from "./utils/constants";

export class SceneManager {
    public scene: THREE.Scene;
    public camera: THREE.OrthographicCamera;
    public renderer: THREE.WebGLRenderer;
    public windowWidth: number;
    public windowHeight: number;
    public canvasWidth: number;
    public canvasHeight: number;
    public marginLeft: number;
    public marginTop: number

    constructor() {
        this.setCanvasSize()
        this.scene = new THREE.Scene();
        this.setCamera()
        this.setRenderer()
        this.onResizeEventListener()
    }

    public setCanvasSize() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        let maxWidthContainer1 = this.windowHeight * SCENE_WIDTH / SCENE_HEIGHT
        container1Element.style.maxWidth = maxWidthContainer1 + 'px'

        
        if(this.windowWidth > maxWidthContainer1) {
            container1Element.style.marginTop = 0 + "px"
            this.marginTop = 0
            this.marginLeft = (this.windowWidth - maxWidthContainer1) / 2 
            this.canvasHeight = this.windowHeight
            this.canvasWidth = maxWidthContainer1
        } else {
            let diff = this.windowHeight - this.windowWidth * SCENE_HEIGHT / SCENE_WIDTH
            container1Element.style.marginTop = diff/2 + "px"
            this.marginTop = diff/2
            this.marginLeft = 0
            this.canvasWidth = this.windowWidth
            this.canvasHeight = this.windowWidth * SCENE_HEIGHT / SCENE_WIDTH
        }
    }

    public setCamera() {
        this.camera = new THREE.OrthographicCamera(
            -SCENE_WIDTH / 2, SCENE_WIDTH / 2, SCENE_HEIGHT / 2, -SCENE_HEIGHT / 2, 1, 1000
        );
        this.camera.position.z = 1000;
    }

    public setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('.webgl') as Element
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.canvasWidth, this.canvasHeight)
    }

    public onResizeEventListener() {
        window.addEventListener('resize', () => {
            this.setCanvasSize()
            this.setRenderer()
        });
    }
}
