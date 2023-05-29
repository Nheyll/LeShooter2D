import THREE = require("three");
import { v4 as uuidv4 } from 'uuid';
import { autoAttacks, character, sceneManager } from "..";
import { buildMesh, isCollision, removeMesh, updateMove } from "../utils/entityUtils";
import { Mob } from "../entities/Mob";
import { AUTOATTACK_COLOR, CHARACTER_AA_SPEED, CHARACTER_DAMAGE, GAME_SPEED } from "../utils/constants"
import { MeshEntity } from "../entities/MeshEntity";
import { AUDIO_BLOW1, AUDIO_BOW1, playAudio } from "../utils/audioUtils";

export class AutoAttack extends MeshEntity {
    public id: uuidv4
    public target: Mob
    public move: THREE.Vector2
    public moveSpeed: number

    constructor(mob: Mob, source:THREE.Vector2) {
        super(buildMesh(30,30,AUTOATTACK_COLOR, new THREE.Vector2(source.x, source.y)))
        playAudio(AUDIO_BOW1)
        this.id = uuidv4();
        this.target = mob
        this.moveSpeed = CHARACTER_AA_SPEED * GAME_SPEED
        this.move = new THREE.Vector2(0,0)
        sceneManager.scene.add(this.mesh);
    }

    public checkCollision(i:number) {
        if(isCollision(this.mesh, this.target.mesh)) {
                autoAttacks.splice(i, 1)
                removeMesh(this.mesh)
                this.target.takeDamage(CHARACTER_DAMAGE)
                playAudio(AUDIO_BLOW1)
        }
    }
    
    public updatePosition() {
        if(this.target.health > 0){
            updateMove(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), new THREE.Vector2(this.target.mesh.position.x, this.target.mesh.position.y), this.move, this.moveSpeed)
            this.mesh.position.x += this.move.x
            this.mesh.position.y += this.move.y
        } else {
            character.movementManager.resetMovementState()
            removeMesh(this.mesh)
            autoAttacks.splice(autoAttacks.findIndex(obj => obj.id === this.id), 1)
        }
    }
}