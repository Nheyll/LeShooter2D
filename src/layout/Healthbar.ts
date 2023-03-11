import * as THREE from "three"
import { sceneManager, gameManager } from "../main"

export class Healthbar {
    public maxHealth:number
    public health:number
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

    constructor() {
        this.maxHealth = 1000
        this.health = 1000
        const geometry = new THREE.PlaneGeometry( this.health, 30, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x7CFC00, side: THREE.DoubleSide } );
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.position.y = - sceneManager.windowHeight/2 + 100
        sceneManager.scene.add( this.mesh );
    }

    public updateHealthBar(lifeDelta: number) {
        this.health += lifeDelta
        if(this.health <= 0) {
            gameManager.onLost()
        }
        if(this.health > this.maxHealth) {
            this.health = this.maxHealth
        }
        this.mesh.scale.x = this.health / this.maxHealth
    }
}