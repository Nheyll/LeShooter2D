import { Vector2 } from "three";
import THREE = require("three");
import { character, mobs } from "..";
import { CHARACTER_DAMAGE, HEALTHBAR_COLOR, RANGEMOB_ATTACK_SPEED, MOB1_IMAGE, RANGEMOB_MAX_HEALTH, RANGEMOB_SIZE, SCENE_HEIGHT, SCENE_WIDTH } from "../utils/constants";
import { buildMesh, buildMeshWithImage, removeMesh } from "../utils/entityUtils";
import { Mob } from "./Mob";
import { Projectile } from "./Projectile";
import { RANGE_DIE, playAudio } from "../utils/audioUtils";

export class RangeMob extends Mob {
    public fireInterval: NodeJS.Timer
    public moveInterval: NodeJS.Timer

    constructor(position: THREE.Vector2) {
        super(buildMeshWithImage(RANGEMOB_SIZE, RANGEMOB_SIZE, MOB1_IMAGE, new THREE.Vector2(position.x, position.y)),
            buildMesh(RANGEMOB_SIZE, 10, HEALTHBAR_COLOR, new THREE.Vector2(position.x, position.y + RANGEMOB_SIZE / 2 + 20)),
            RANGEMOB_MAX_HEALTH)

        this.moveInterval = setInterval(() => {
            this.updateMoveRandomly()
        }, 1000);

        setTimeout(() => {
            this.startFiring()
        }, 2000)
    }

    public startFiring() {
        this.fireInterval = setInterval(() => {
            this.fireProjectile()
        }, RANGEMOB_ATTACK_SPEED);
    }

    public fireProjectile() {
        new Projectile(new Vector2(this.mesh.position.x, this.mesh.position.y), character.movementManager.current)
    }

    public takeDamage() {
        this.health -= CHARACTER_DAMAGE
        this.healthbar.scale.x = this.health / this.maxHealth
        if (this.health <= 0) {
            character.movementManager.resetMovementState()
            this.die()
            mobs.splice(mobs.indexOf(this), 1)
        }
    }

    public die() {
        playAudio(RANGE_DIE)
        removeMesh(this.mesh)
        removeMesh(this.healthbar)
        clearInterval(this.fireInterval)
        clearInterval(this.moveInterval)
    }

    public updateMoveRandomly() {
        if (this.mesh.position.x > SCENE_WIDTH / 2 - 100) {
            this.move = new THREE.Vector2(-1, 0);
        } else if (this.mesh.position.x < -SCENE_WIDTH / 2 + 100) {
            this.move = new THREE.Vector2(1, 0);
        } else if (this.mesh.position.y > SCENE_HEIGHT / 2 - 100) {
            this.move = new THREE.Vector2(0, -1);
        } else if (this.mesh.position.y < - SCENE_HEIGHT / 2 + 100) {
            this.move = new THREE.Vector2(0, 1);
        } else {
            this.move = this.generateRandomMove()
        }
        this.move = this.move.multiplyScalar(this.moveSpeed)
    }

    public generateRandomMove() {
        let x = Math.random()
        let y = 1 - x;
        let oneOrTwo = Math.floor(Math.random() * 2) + 1;
        if (oneOrTwo == 1)
            y = -y
        oneOrTwo = Math.floor(Math.random() * 2) + 1;
        if (oneOrTwo == 1)
            x = -x
        return new THREE.Vector2(x, y)
    }
}