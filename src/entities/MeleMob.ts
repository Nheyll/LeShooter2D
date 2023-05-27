import THREE = require("three");
import { MELEMOB_SIZE, MOB2_IMAGE, HEALTHBAR_COLOR, MELEMOB_MAX_HEALTH, CHARACTER_DAMAGE, MELEMOB_DAMAGE, MELEMOB_ATTACK_SPEED, MELEMOB_SPEED } from "../utils/constants";
import { buildMesh, buildMeshWithImage, isCollision, removeMesh, updateMove } from "../utils/entityUtils";
import { Mob } from "./Mob";
import { character, gameManager, mobs } from ".."
import { AUDIO_BLOW5, MELE_DIE, playAudio } from "../utils/audioUtils";

export class MeleMob extends Mob {

    public isAutoAttackCooldown: boolean
    public moveInterval: NodeJS.Timer

    constructor(position: THREE.Vector2) {
        super(buildMeshWithImage(MELEMOB_SIZE, MELEMOB_SIZE, MOB2_IMAGE, new THREE.Vector2(position.x, position.y)),
            buildMesh(MELEMOB_SIZE, 10, HEALTHBAR_COLOR, new THREE.Vector2(position.x, position.y + MELEMOB_SIZE / 2 + 20)),
            MELEMOB_MAX_HEALTH)
        this.isAutoAttackCooldown = true

        setTimeout(() => {
            this.isAutoAttackCooldown = false
        }, 2000)

        this.moveInterval = setInterval(() => {
            updateMove(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), character.movementManager.current, this.move, MELEMOB_SPEED)
        }, 200);

    }

    public takeDamage() {
        this.health -= CHARACTER_DAMAGE
        this.healthbar.scale.x = this.health / this.maxHealth
        if (this.health <= 0) {
            this.die()
            mobs.splice(mobs.indexOf(this), 1)
        }
    }

    public die(){
        playAudio(MELE_DIE)
        removeMesh(this.mesh)
        removeMesh(this.healthbar)
        clearInterval(this.moveInterval)
    }

    public checkCollision() {
        if (isCollision(character.mesh, this.mesh) && !this.isAutoAttackCooldown) {
            playAudio(AUDIO_BLOW5)
            character.healthManager.updateHealth(-MELEMOB_DAMAGE * gameManager.difficultyMultiplier)
            this.isAutoAttackCooldown = true
            setTimeout(() => {
                this.isAutoAttackCooldown = false
            }, MELEMOB_ATTACK_SPEED)
        }
    }
}