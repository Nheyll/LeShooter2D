import * as THREE from 'three';
import { character, mobs, sceneManager } from '../main';
import { MeshEntity } from '../MeshEntity';
import { GAME_SPEED, RANGEMOB_SPEED, CHARACTER_DAMAGE } from '../utils/constants';
import { isCollision, removeMesh } from '../utils/entityUtils';
import { MeleMob } from './MeleMob';

export class Mob extends MeshEntity {

    public move: THREE.Vector2
    public moveSpeed: number
    public maxHealth: number
    public health: number
    public healthbar: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>


    constructor(mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>, healthbar: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>, maxHealth: number) {
        super(mesh)
        this.healthbar = healthbar
        this.maxHealth = maxHealth
        this.health = this.maxHealth
        this.move = new THREE.Vector2(0, 0)
        this.moveSpeed = RANGEMOB_SPEED + GAME_SPEED
        sceneManager.scene.add(this.mesh);
        sceneManager.scene.add(this.healthbar);
        mobs.push(this)
    }

    public updatePosition() {
        this.mesh.position.x += this.move.x
        this.mesh.position.y += this.move.y
        this.healthbar.position.x += this.move.x
        this.healthbar.position.y += this.move.y
    }

    public takeDamage() {
        this.health -= CHARACTER_DAMAGE
        this.healthbar.scale.x = this.health / this.maxHealth
        if (this.health <= 0) {
            removeMesh(this.mesh)
            removeMesh(this.healthbar)
            mobs.splice(mobs.indexOf(this), 1)
        }
    }

    public checkCollision() {
    }

    public die() {
    }
}