import * as THREE from 'three';
import { Vector2 } from 'three';
import { sceneManager, character, gameManager, mobs } from '../main';
import { MeshEntity } from '../MeshEntity';
import { CHARACTER_DAMAGE, DEFAULT_GAME_SPEED, DEFAULT_MOB_SPEED, MOB_ATTACK_SPEED, MOB_MAX_HEALTH } from '../utils/constants';
import { buildMesh, removeMesh } from '../utils/entityUtils';
import { Projectile } from './Projectile';

export class Mob extends MeshEntity {
    public move: THREE.Vector2
    public moveSpeed: number
    public maxHealth: number
    public health: number

    constructor(position: THREE.Vector2) {
        super(buildMesh(100, 100, "0xffff00", new THREE.Vector2(position.x, position.x)))
        this.maxHealth = MOB_MAX_HEALTH
        this.health = this.maxHealth
        this.move = new THREE.Vector2(0,0)
        this.moveSpeed = DEFAULT_MOB_SPEED + DEFAULT_GAME_SPEED
        sceneManager.scene.add(this.mesh);
        setInterval(() => {
            this.updateMoveRandomly()
        }, 1000);
        
        setTimeout(() => {
            this.startFiring()
        }, 3000)
        mobs.push(this)
    }

    public updateMoveRandomly(){
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
    
    public startFiring() {
        setInterval(() => {
            this.fireProjectile()
        }, MOB_ATTACK_SPEED);
    }

    public fireProjectile() {
        if(gameManager.isGameRunning)
            new Projectile(new Vector2(this.mesh.position.x, this.mesh.position.y), character.current)
    }

    public takeDamage() {
        this.health -= CHARACTER_DAMAGE
        if(this.health <= 0) {
            removeMesh(this.mesh)
            mobs.splice(mobs.indexOf(this), 1)
        }
    }
}