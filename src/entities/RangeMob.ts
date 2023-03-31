import { Vector2 } from "three";
import THREE = require("three");
import { character, mobs, sceneManager } from "../main";
import { CHARACTER_DAMAGE, HEALTHBAR_COLOR, RANGEMOB_ATTACK_SPEED, RANGEMOB_COLOR, RANGEMOB_MAX_HEALTH, RANGEMOB_SIZE } from "../utils/constants";
import { buildMesh, removeMesh } from "../utils/entityUtils";
import { Mob } from "./Mob";
import { Projectile } from "./Projectile";

export class RangeMob extends Mob {
    public fireInterval: NodeJS.Timer
    public moveInterval: NodeJS.Timer

    constructor(position: THREE.Vector2) {
        super(buildMesh(RANGEMOB_SIZE, RANGEMOB_SIZE, RANGEMOB_COLOR, new THREE.Vector2(position.x, position.y)),
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
        new Projectile(new Vector2(this.mesh.position.x, this.mesh.position.y), character.current)
    }

    public takeDamage() {
        this.health -= CHARACTER_DAMAGE
        this.healthbar.scale.x = this.health / this.maxHealth
        if (this.health <= 0) {
            this.die()
            mobs.splice(mobs.indexOf(this), 1)
        }
    }

    public die() {
        removeMesh(this.mesh)
        removeMesh(this.healthbar)
        clearInterval(this.fireInterval)
        clearInterval(this.moveInterval)
    }

    public updateMoveRandomly() {
        if (this.mesh.position.x > sceneManager.windowWidth / 2 - 100) {
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