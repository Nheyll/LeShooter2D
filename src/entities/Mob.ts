import * as THREE from 'three';
import { Vector2 } from 'three';
import { sceneManager, character } from '../main';
import { DEFAULT_GAME_SPEED, DEFAULT_MOB_SPEED, MOB_ATTACK_SPEED } from '../utils/constants';
import { Projectile } from './Projectile';

export class Mob {
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public move: THREE.Vector2
    public moveSpeed: number

    constructor(position: THREE.Vector2) {
        const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = position.x
        this.mesh.position.y = position.y
        this.move = new THREE.Vector2(0,0)
        this.moveSpeed = DEFAULT_MOB_SPEED + DEFAULT_GAME_SPEED
        sceneManager.scene.add(this.mesh);
        setInterval(() => {
            this.updateMove()
        }, 1000);
        setInterval(() => {
            this.fireProjectile()
        }, MOB_ATTACK_SPEED);
    }

    public updateMove(){
        if(this.mesh.position.x > sceneManager.windowWidth / 2 -100) {
            this.move = new THREE.Vector2(-1, 0);
        } else if (this.mesh.position.x < -sceneManager.windowWidth / 2 + 100) {
            this.move = new THREE.Vector2(1, 0);
        } else if (this.mesh.position.y > sceneManager.windowHeight / 2 - 100) {
            this.move = new THREE.Vector2(0, -1);
        } else if (this.mesh.position.y < -sceneManager.windowHeight / 2 + 100) {
            this.move = new THREE.Vector2(0, 1);
        } else {
            this.move = this.generateRandomMove()
        }
        this.move = this.move.multiplyScalar(this.moveSpeed)
    }

    public generateRandomMove(){
        let x = Math.random()
        let y = 1-x;
        let oneOrTwo = Math.floor(Math.random() * 2) + 1;
        if (oneOrTwo == 1)
            y = -y
        oneOrTwo = Math.floor(Math.random() * 2) + 1;
        if(oneOrTwo == 1)
            x = -x
        return new THREE.Vector2(x,y)
    }

    public updatePosition() {
        this.mesh.position.x += this.move.x
        this.mesh.position.y += this.move.y
    }

    public fireProjectile() {
        new Projectile(new Vector2(this.mesh.position.x, this.mesh.position.y), character.current)
    }
}