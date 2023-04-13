import THREE = require("three")
import { character, gameManager, sceneManager } from ".."
import { 
    HEALTHBAR_COLOR, 
    SCENE_HEIGHT, 
    RED_COLOR, 
    SPELL_AS_COOLDOWN, 
    SPELL_AS_DURATION, 
    SPELL_AS_MANA_COST, 
    SPELL_HEAL_COOLDOWN, 
    SPELL_HEAL_MANA_COST, 
    SPELL_HEAL_VALUE, 
    WHITE_COLOR 
} from "../utils/constants"
import { buildMesh, buildTextPromise, removeMesh } from "../utils/entityUtils"

export class SpellManager {
    public isAttackSpeedCooldown: boolean
    public isHealCooldown: boolean
    public healMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public attackSpeedMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public healCooldownDisplay: THREE.Mesh
    public attackSpeedCooldownDisplay: THREE.Mesh
    public attackSpeedCooldownDisplayInterval: NodeJS.Timer
    public healCooldownDisplayInterval: NodeJS.Timer

    constructor() {
        this.isAttackSpeedCooldown = false
        this.isHealCooldown = false

        this.healMesh = buildMesh(70, 70, HEALTHBAR_COLOR, new THREE.Vector2(-100, -SCENE_HEIGHT/2 + 180))
        this.attackSpeedMesh = buildMesh(70, 70, RED_COLOR, new THREE.Vector2(100, -SCENE_HEIGHT/2 + 180))

        sceneManager.scene.add(this.attackSpeedMesh)
        sceneManager.scene.add(this.healMesh)

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
    public castSpellAttackSpeed() {
        if(!this.isAttackSpeedCooldown && character.manaManager.hasEnoughMana(SPELL_AS_MANA_COST)){
            character.autoAttackManager.attackSpeed /= 2
            character.autoAttackManager.attackWindup /= 2
            this.isAttackSpeedCooldown = true
            this.startAttackCooldownDisplay()

            setTimeout(() => {
                character.autoAttackManager.attackSpeed *= 2
                character.autoAttackManager.attackWindup *= 2 
            }, SPELL_AS_DURATION)

            setTimeout(() => {
                this.isAttackSpeedCooldown = false
            }, SPELL_AS_COOLDOWN)
    
            character.manaManager.updateMana(-SPELL_AS_MANA_COST)
        } else if(this.isAttackSpeedCooldown){
            gameManager.writeTemporaryWarning("Spell is on cooldown")
        } else if(!character.manaManager.hasEnoughMana(SPELL_AS_MANA_COST)) {
            gameManager.writeTemporaryWarning("Not enough mana")
        }
    }

    public castSpellHeal() {
        if(!this.isHealCooldown && character.manaManager.hasEnoughMana(SPELL_HEAL_MANA_COST) && character.healthManager.health < character.healthManager.maxHealth){
            character.healthManager.updateHealth(SPELL_HEAL_VALUE)
            character.manaManager.updateMana(-SPELL_HEAL_MANA_COST)
            
            this.isHealCooldown = true
            this.starthealCooldownDisplay()
            setTimeout(() => {
                this.isHealCooldown = false
            }, SPELL_HEAL_COOLDOWN)

        } else if(this.isHealCooldown){
            gameManager.writeTemporaryWarning("Spell is on cooldown")
        } else if(!character.manaManager.hasEnoughMana(SPELL_HEAL_MANA_COST)) {
            gameManager.writeTemporaryWarning("Not enough mana")
        } else if(character.healthManager.health = character.healthManager.maxHealth) {
            gameManager.writeTemporaryWarning("Already full life")
        }
    }

    public starthealCooldownDisplay() {
        let cooldownLeft = SPELL_HEAL_COOLDOWN / 1000
        
        this.healCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.healCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-110, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.healCooldownDisplay = mesh
                    sceneManager.scene.add(this.healCooldownDisplay)
                })
        }, 1000)

        setTimeout(() => {
            removeMesh(this.healCooldownDisplay)
            clearInterval(this.healCooldownDisplayInterval)
        }, SPELL_HEAL_COOLDOWN + 500)
    }

    public startAttackCooldownDisplay() {
        let cooldownLeft = SPELL_AS_COOLDOWN / 1000
        
        this.attackSpeedCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.attackSpeedCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(90, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.attackSpeedCooldownDisplay = mesh
                    sceneManager.scene.add(this.attackSpeedCooldownDisplay)
                })
        }, 1000)

        setTimeout(() => {
            removeMesh(this.attackSpeedCooldownDisplay)
            clearInterval(this.attackSpeedCooldownDisplayInterval)
        }, SPELL_AS_COOLDOWN + 500)
    }

    resetSpellState() {
        clearInterval(this.healCooldownDisplayInterval)
        clearInterval(this.attackSpeedCooldownDisplayInterval)
        removeMesh(this.healCooldownDisplay)
        removeMesh(this.attackSpeedCooldownDisplay)   
        this.isAttackSpeedCooldown = false
        this.isHealCooldown = false
    }
}