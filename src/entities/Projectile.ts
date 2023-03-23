import { Vector2 } from 'three';
import THREE = require('three');
import { sceneManager, projectiles } from '../main';
import { MeshEntity } from '../MeshEntity';
import { GAME_SPEED, PROJECTILE_SPEED } from '../utils/constants';
import { isCollision, updateMove, removeMesh, isOutOfBound, buildMesh } from '../utils/entityUtils';
import { Character } from './Character';


export class Projectile extends MeshEntity {
    public move: THREE.Vector2
    public moveSpeed: number

    constructor(source:THREE.Vector2, target:THREE.Vector2) {
        super(buildMesh(30, 30, "0xFF1493", new THREE.Vector2(source.x, source.y)))
        this.moveSpeed = PROJECTILE_SPEED + GAME_SPEED
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