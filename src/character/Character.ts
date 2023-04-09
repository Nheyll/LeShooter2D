import { Direction } from "../utils/enums"
import * as THREE from "three"
import { mobs, sceneManager, gameManager } from "../main"
import { GAME_SPEED, CHARACTER_SPEED, SPELL_AS_COOLDOWN, SPELL_AS_DURATION, SPELL_AS_MANA_COST, CHARACTER_COLOR, SPELL_HEAL_MANA_COST, SPELL_HEAL_VALUE, SPELL_HEAL_COOLDOWN, HEALTHBAR_COLOR, SCENE_HEIGHT, RED_COLOR, WHITE_COLOR } from "../utils/constants"
import { buildMesh, isClickOnMesh, updateMove, convertClickToTarget, isClickOnCanvas, buildTextPromise } from "../utils/entityUtils"
import { Healthbar } from "./Healthbar"
import { Manabar } from "./Manabar"
import { MeshEntity } from "../entities/MeshEntity"
import { Vector2 } from "three"
import { removeMesh } from "../utils/entityUtils"
import { AutoAttackManager } from "./AutoAttackManager"

export class Character extends MeshEntity {
    public autoAttackManager: AutoAttackManager
    public move: THREE.Vector2
    public current: THREE.Vector2
    public target: THREE.Vector2
    public moveDirection: string
    public moveSpeed: number
    public healthbar: Healthbar
    public manabar: Manabar
    public isSpellAttackSpeedCooldown: boolean
    public isSpellHealCooldown: boolean
    public spellHealMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public spellAttackSpeedMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public spellHealCooldownDisplay: THREE.Mesh
    public spellAttackSpeedCooldownDisplay: THREE.Mesh
    public spellAttackSpeedCooldownDisplayInterval: NodeJS.Timer
    public spellHealCooldownDisplayInterval: NodeJS.Timer

    constructor() {
        super(buildMesh(100, 100, CHARACTER_COLOR, new Vector2(-100, -100)))
        this.autoAttackManager = new AutoAttackManager()
        this.healthbar = new Healthbar()
        this.manabar = new Manabar()
        this.move = new THREE.Vector2(0, 0);
        this.current = new THREE.Vector2(0, 0);
        this.target = new THREE.Vector2(0, 0);
        this.moveDirection = Direction.NOT_MOVING;
        this.moveSpeed = GAME_SPEED * CHARACTER_SPEED
        this.isSpellAttackSpeedCooldown = false
        this.isSpellHealCooldown = false

        this.spellHealMesh = buildMesh(70, 70, HEALTHBAR_COLOR, new THREE.Vector2(-100, -SCENE_HEIGHT/2 + 180))
        this.spellAttackSpeedMesh = buildMesh(70, 70, RED_COLOR, new THREE.Vector2(100, -SCENE_HEIGHT/2 + 180))

        sceneManager.scene.add(this.spellAttackSpeedMesh)
        sceneManager.scene.add(this.spellHealMesh)
        sceneManager.scene.add( this.mesh );

        window.addEventListener('contextmenu', (event) => {
            this.onRightClick(event);
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'a' || event.key === 'q') {
                this.castSpellHeal()
            }
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'w' || event.key === 'z') {
                this.castSpellAttackSpeed()
            }
        });
    }

    public onRightClick(event: MouseEvent) {
        if(!isClickOnCanvas(event)){
            return
        }
        this.target = convertClickToTarget(event, sceneManager);
        let flagFocus = false
        for(let i = 0; i < mobs.length; i++) {
            if(isClickOnMesh(this.target, mobs[i].mesh)){
                this.autoAttackManager.focus = mobs[i]
                flagFocus = true
                break
            }
        }
        if(flagFocus == false) {
            this.autoAttackManager.focus = null
            this.onMove()
        } else if(this.moveDirection != Direction.AA) {
            this.moveDirection = Direction.AA
            this.move.set(0,0)
            this.autoAttackManager.onAutoAttack()
        }
    }

    public onMove() {
        this.autoAttackManager.isAutoAttacking = false
        this.setDirection();
        updateMove(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), this.target, this.move, this.moveSpeed)
    }

    public setDirection() {
        if(this.target.x > this.current.x){
            if(this.target.y > this.current.y) {
                this.moveDirection = Direction.NE;
            }else{
                this.moveDirection = Direction.SE;
            }
        } else {
            if(this.target.y > this.current.y) {
                this.moveDirection = Direction.NW;
            }else{
                this.moveDirection = Direction.SW;
            }
        }
    }

    public updatePosition() {
        if (this.moveDirection == Direction.NE && (this.current.x+this.move.x > this.target.x || this.current.y+this.move.y > this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        } else if (this.moveDirection == Direction.NW && (this.current.x+this.move.x < this.target.x || this.current.y+this.move.y > this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        } else if (this.moveDirection == Direction.SE && (this.current.x+this.move.x > this.target.x || this.current.y+this.move.y < this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        } else if (this.moveDirection == Direction.SW && (this.current.x+this.move.x < this.target.x || this.current.y+this.move.y < this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        }
    
        if(this.moveDirection != Direction.NOT_MOVING){
            this.current.set(this.current.x + this.move.x, this.current.y + this.move.y);
            this.mesh.position.x = this.current.x;
            this.mesh.position.y = this.current.y;
        } else {
            this.current.set(this.target.x, this.target.y);
            this.mesh.position.x = this.target.x;
            this.mesh.position.y = this.target.y;
        }
    }

    public resetState() {
        this.healthbar.health = this.healthbar.maxHealth
        this.healthbar.updateHealthBar(-1)
        this.manabar.mana = this.manabar.maxMana
        this.manabar.updateManabar(0)
        this.autoAttackManager.resetAutoAttackState()
        this.moveDirection = Direction.NOT_MOVING;
        clearInterval(this.spellHealCooldownDisplayInterval)
        clearInterval(this.spellAttackSpeedCooldownDisplayInterval)
        removeMesh(this.spellHealCooldownDisplay)
        removeMesh(this.spellAttackSpeedCooldownDisplay)   
        this.isSpellAttackSpeedCooldown = false
        this.isSpellHealCooldown = false
    }

    public castSpellAttackSpeed() {
        if(!this.isSpellAttackSpeedCooldown && this.manabar.hasEnoughMana(SPELL_AS_MANA_COST)){
            this.autoAttackManager.attackSpeed /= 2
            this.autoAttackManager.attackWindup /= 2
            this.isSpellAttackSpeedCooldown = true
            this.startAttackCooldownDisplay()

            setTimeout(() => {
                this.autoAttackManager.attackSpeed *= 2
                this.autoAttackManager.attackWindup *= 2 
            }, SPELL_AS_DURATION)

            setTimeout(() => {
                this.isSpellAttackSpeedCooldown = false
            }, SPELL_AS_COOLDOWN)
    
            this.manabar.updateManabar(-SPELL_AS_MANA_COST)
        } else if(this.isSpellAttackSpeedCooldown){
            gameManager.writeTemporaryWarning("Spell is on cooldown")
        } else if(!this.manabar.hasEnoughMana(SPELL_AS_MANA_COST)) {
            gameManager.writeTemporaryWarning("Not enough mana")
        }
    }

    public castSpellHeal() {
        if(!this.isSpellHealCooldown && this.manabar.hasEnoughMana(SPELL_HEAL_MANA_COST) && this.healthbar.health < this.healthbar.maxHealth){
            this.healthbar.updateHealthBar(SPELL_HEAL_VALUE)
            this.manabar.updateManabar(-SPELL_HEAL_MANA_COST)
            
            this.isSpellHealCooldown = true
            this.startHealCooldownDisplay()
            setTimeout(() => {
                this.isSpellHealCooldown = false
            }, SPELL_HEAL_COOLDOWN)

        } else if(this.isSpellHealCooldown){
            gameManager.writeTemporaryWarning("Spell is on cooldown")
        } else if(!this.manabar.hasEnoughMana(SPELL_HEAL_MANA_COST)) {
            gameManager.writeTemporaryWarning("Not enough mana")
        } else if(this.healthbar.health = this.healthbar.maxHealth) {
            gameManager.writeTemporaryWarning("Already full life")
        }
    }

    public startHealCooldownDisplay() {
        let cooldownLeft = SPELL_HEAL_COOLDOWN / 1000
        
        this.spellHealCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.spellHealCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-110, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.spellHealCooldownDisplay = mesh
                    sceneManager.scene.add(this.spellHealCooldownDisplay)
                })
        }, 1000)

        setTimeout(() => {
            removeMesh(this.spellHealCooldownDisplay)
            clearInterval(this.spellHealCooldownDisplayInterval)
        }, SPELL_HEAL_COOLDOWN + 500)
    }

    public startAttackCooldownDisplay() {
        let cooldownLeft = SPELL_AS_COOLDOWN / 1000
        
        this.spellAttackSpeedCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.spellAttackSpeedCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(90, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.spellAttackSpeedCooldownDisplay = mesh
                    sceneManager.scene.add(this.spellAttackSpeedCooldownDisplay)
                })
        }, 1000)

        setTimeout(() => {
            removeMesh(this.spellAttackSpeedCooldownDisplay)
            clearInterval(this.spellAttackSpeedCooldownDisplayInterval)
        }, SPELL_AS_COOLDOWN + 500)
    }
}