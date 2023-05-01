import { Vector2 } from 'three';
import THREE = require('three');
import { sceneManager, projectiles } from '..';
import { MeshEntity } from './MeshEntity';
import { GAME_SPEED, PROJECTILE_COLOR, PROJECTILE_SIZE, PROJECTILE_SPEED, RANGEMOB_DAMAGE } from '../utils/constants';
import { isCollision, updateMove, removeMesh, isOutOfBound, buildMesh } from '../utils/entityUtils';
import { Character } from '../character/Character';
import { AUDIO_BLOW2, AUDIO_BOW2, playAudio } from '../utils/audioUtils';


export class Projectile extends MeshEntity {
    public move: THREE.Vector2
    public moveSpeed: number

    constructor(source: THREE.Vector2, target: THREE.Vector2) {
        super(buildMesh(PROJECTILE_SIZE, PROJECTILE_SIZE, PROJECTILE_COLOR, new THREE.Vector2(source.x, source.y)))
        playAudio(AUDIO_BOW2)
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

    public checkCollision(i: number, character: Character) {
        if (isCollision(this.mesh, character.mesh)) {
            playAudio(AUDIO_BLOW2)
            projectiles.splice(i, 1)
            removeMesh(this.mesh)
            character.healthManager.updateHealth(-RANGEMOB_DAMAGE)
        }
    }

    public checkOutOfBound(i: number) {
        if (isOutOfBound(this.mesh)) {
            projectiles.splice(i, 1)
            removeMesh(this.mesh)
        }
    }
}