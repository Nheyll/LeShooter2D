import THREE = require("three");
import { MELEMOB_SIZE, MELEMOB_COLOR, HEALTHBAR_COLOR, MELEMOB_MAX_HEALTH, CHARACTER_DAMAGE, MELEMOB_DAMAGE, MELEMOB_ATTACK_SPEED, MELEMOB_SPEED } from "../utils/constants";
import { buildMesh, isCollision, removeMesh, updateMove } from "../utils/entityUtils";
import { Mob } from "./Mob";
import { character, mobs } from "../main"

export class MeleMob extends Mob {

    public isAutoAttackCooldown: boolean
    public moveInterval: NodeJS.Timer

    constructor(position: THREE.Vector2) {
        super(buildMesh(MELEMOB_SIZE, MELEMOB_SIZE, MELEMOB_COLOR, new THREE.Vector2(position.x, position.y)),
            buildMesh(MELEMOB_SIZE, 10, HEALTHBAR_COLOR, new THREE.Vector2(position.x, position.y + MELEMOB_SIZE / 2 + 20)),
            MELEMOB_MAX_HEALTH)
        this.isAutoAttackCooldown = false
        this.moveInterval = setInterval(() => {
            updateMove(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), character.current, this.move, MELEMOB_SPEED)
        }, 200);

    }

    public takeDamage() {
        this.health -= CHARACTER_DAMAGE
        this.healthbar.scale.x = this.health / this.maxHealth
        if (this.health <= 0) {
            removeMesh(this.mesh)
            removeMesh(this.healthbar)
            mobs.splice(mobs.indexOf(this), 1)
            clearInterval(this.moveInterval)
        }
    }

    public checkCollision() {
        if (isCollision(character.mesh, this.mesh) && !this.isAutoAttackCooldown) {
            character.healthbar.updateHealthBar(-MELEMOB_DAMAGE)
            this.isAutoAttackCooldown = true
            setTimeout(() => {
                this.isAutoAttackCooldown = false
            }, MELEMOB_ATTACK_SPEED)
        }
    }
}