import * as THREE from "three"
import { sceneManager } from "../main"
import { CHARACTER_MAX_MANA, CHARACTER_REGEN_MANA, MANABAR_COLOR, SCENE_HEIGHT } from "../utils/constants"
import { MeshEntity } from "../entities/MeshEntity"
import { buildMesh } from "../utils/entityUtils"

export class Manabar extends MeshEntity {
    public maxMana: number
    public mana: number
    public regenManaInterval: NodeJS.Timer

    constructor() {
        super(buildMesh(CHARACTER_MAX_MANA, 30, MANABAR_COLOR, new THREE.Vector2(0, -SCENE_HEIGHT / 2 + 50)))
        this.maxMana = CHARACTER_MAX_MANA
        this.mana = CHARACTER_MAX_MANA
        sceneManager.scene.add(this.mesh);

        this.regenManaInterval = setInterval(() => {
            this.regenMana()
        }, 1000)
    }

    public regenMana() {
        if (this.mana < this.maxMana) {
            if (this.mana + CHARACTER_REGEN_MANA <= this.maxMana) {
                this.updateManabar(CHARACTER_REGEN_MANA)
            } else {
                this.updateManabar(this.maxMana - this.mana)
            }
        }
    }

    public updateManabar(manaDelta: number) {
        this.mana = this.mana + manaDelta
        this.mesh.scale.x = this.mana / this.maxMana
    }

    public hasEnoughMana(manaDelta: number) {
        if(this.mana >= manaDelta)
            return true
        else
            return false
    }
}