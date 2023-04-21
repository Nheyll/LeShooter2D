import * as THREE from "three"
import { sceneManager } from ".."
import { CHARACTER_MAX_HEALTH, HEALTHBAR_COLOR, SCENE_HEIGHT } from "../utils/constants"
import { MeshEntity } from "../entities/MeshEntity"
import { buildMesh } from "../utils/entityUtils"

export class HealthManager extends MeshEntity {
    public maxHealth:number
    public health:number

    constructor() {
        super(buildMesh(CHARACTER_MAX_HEALTH, 30, HEALTHBAR_COLOR, new THREE.Vector2(0, -SCENE_HEIGHT/2 + 100)))
        this.maxHealth = CHARACTER_MAX_HEALTH
        this.health = this.maxHealth
        sceneManager.scene.add( this.mesh );
    }

    public updateHealth(lifeDelta: number) {
        this.health += lifeDelta

        if(this.health > this.maxHealth) {
            this.health = this.maxHealth
        }
        this.mesh.scale.x = this.health / this.maxHealth
    }

    public resetHealthState() {
        this.health = this.maxHealth
        this.updateHealth(0)
    }
}