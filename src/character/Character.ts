import { Direction } from "../utils/enums"
import { mobs, sceneManager } from ".."
import { CHARACTER_COLOR } from "../utils/constants"
import { buildMesh, isClickOnMesh, updateMove, convertClickToTarget, isClickOnCanvas } from "../utils/entityUtils"
import { HealthManager } from "./HealthManager"
import { ManaManager } from "./ManaManager"
import { MeshEntity } from "../entities/MeshEntity"
import { Vector2 } from "three"
import { AutoAttackManager } from "./AutoAttackManager"
import { SpellManager } from "./SpellManager"
import { MovementManager } from "./MovementManager"

export class Character extends MeshEntity {
    public autoAttackManager: AutoAttackManager
    public spellManager: SpellManager
    public movementManager: MovementManager
    public healthManager: HealthManager
    public manaManager: ManaManager

    constructor() {
        super(buildMesh(100, 100, CHARACTER_COLOR, new Vector2(-100, -100)))
        this.autoAttackManager = new AutoAttackManager()
        this.spellManager = new SpellManager()
        this.healthManager = new HealthManager()
        this.manaManager = new ManaManager()
        this.movementManager = new MovementManager()

        sceneManager.scene.add( this.mesh );

        window.addEventListener('contextmenu', (event) => {
            this.onRightClick(event);
        });
    }

    public onRightClick(event: MouseEvent) {
        if(!isClickOnCanvas(event)){
            return
        }
        this.movementManager.target = convertClickToTarget(event, sceneManager);
        let flagFocus = false
        for(let i = 0; i < mobs.length; i++) {
            if(isClickOnMesh(this.movementManager.target, mobs[i].mesh)){
                this.autoAttackManager.focus = mobs[i]
                flagFocus = true
                break
            }
        }
        if(flagFocus == false) {
            this.autoAttackManager.focus = null
            this.movementManager.onMove()
        } else if(this.movementManager.moveDirection != Direction.AA) {
            this.movementManager.moveDirection = Direction.AA
            this.movementManager.move.set(0,0)
            this.autoAttackManager.onAutoAttack()
        }
    }

    public resetState() {
        this.healthManager.resetHealthState()
        this.manaManager.resetManaState()
        this.autoAttackManager.resetAutoAttackState()
        this.spellManager.resetSpellState()
        this.movementManager.resetMovementState()
    }
}