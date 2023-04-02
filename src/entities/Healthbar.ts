import * as THREE from "three"
import { sceneManager } from "../main"
import { CHARACTER_MAX_HEALTH, HEALTHBAR_COLOR, SCENE_HEIGHT } from "../utils/constants"
import { MeshEntity } from "../MeshEntity"
import { buildMesh } from "../utils/entityUtils"

export class Healthbar extends MeshEntity {
    public maxHealth:number
    public health:number

    constructor() {
        super(buildMesh(CHARACTER_MAX_HEALTH, 30, HEALTHBAR_COLOR, new THREE.Vector2(0, -SCENE_HEIGHT/2 + 100)))
        this.maxHealth = CHARACTER_MAX_HEALTH
        this.health = this.maxHealth
        sceneManager.scene.add( this.mesh );
    }

    public updateHealthBar(lifeDelta: number) {
        this.health += lifeDelta

        if(this.health > this.maxHealth) {
            this.health = this.maxHealth
        }
        this.mesh.scale.x = this.health / this.maxHealth
    }
}