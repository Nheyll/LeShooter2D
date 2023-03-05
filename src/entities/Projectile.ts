import { Vector2 } from 'three';
import THREE = require('three');
import { sceneManager, projectiles } from '../main';
import { DEFAULT_GAME_SPEED, DEFAULT_PROJECTILE_SPEED } from '../utils/constants';
import { isCollision, updateMove, removeMesh, isOutOfBound } from '../utils/entityUtils';
import { Character } from './Character';


export class Projectile {
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public move: THREE.Vector2
    public moveSpeed: number

    constructor(source:THREE.Vector2, target:THREE.Vector2) {
        const geometry = new THREE.PlaneGeometry(30, 30, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF1493 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = source.x
        this.mesh.position.y = source.y
        this.moveSpeed = DEFAULT_PROJECTILE_SPEED + DEFAULT_GAME_SPEED
        this.move = new Vector2()
        updateMove(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), target, this.move, this.moveSpeed)
        sceneManager.scene.add(this.mesh);
        projectiles.push(this)
    }

    public updatePosition() {
        this.mesh.position.x += this.move.x
        this.mesh.position.y += this.move.y
    }

    public checkCollision(i:number, character:Character) {
        if(isCollision(this.mesh, character.mesh)){
            projectiles.splice(i, 1)
            removeMesh(this.mesh)
            character.healthbar.updateHealthBar(-100)
        }
    }

    public checkOutOfBound(i:number) {
        if(isOutOfBound(this.mesh)) {
            projectiles.splice(i, 1)
            removeMesh(this.mesh)
        }
    }
}