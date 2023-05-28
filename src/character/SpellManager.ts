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
    WHITE_COLOR, 
    TELEPORT_COLOR,
    SPELL_TELEPORT_COOLDOWN,
    SPELL_TELEPORT_MANA_COST
} from "../utils/constants"
import { buildMesh, buildTextPromise, convertClickToTarget, removeMesh } from "../utils/entityUtils"
import { HEAL, SPELL_AS, TELEPORT, playAudio } from "../utils/audioUtils"
import { GameState } from "../utils/enums"

export class SpellManager {
    public isAttackSpeedCooldown: boolean
    public isHealCooldown: boolean
    public isTeleportCooldown: boolean

    public healMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public attackSpeedMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public teleportMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

    public healCooldownDisplay: THREE.Mesh
    public attackSpeedCooldownDisplay: THREE.Mesh
    public teleportCooldownDisplay: THREE.Mesh

    public attackSpeedCooldownDisplayInterval: NodeJS.Timer
    public healCooldownDisplayInterval: NodeJS.Timer
    public teleportCooldownDisplayInterval: NodeJS.Timer

    public attackSpeedCooldownTimeout: NodeJS.Timeout
    public healCooldownTimeout: NodeJS.Timeout
    public teleportCooldownTimeout: NodeJS.Timeout

    public attackSpeedDisplayTimeout: NodeJS.Timeout
    public healDisplayTimeout: NodeJS.Timeout
    public teleportDisplayTimeout: NodeJS.Timeout

    public isAttackSpeedBuff: boolean
    public isAttackSpeedBuffTimeout: NodeJS.Timeout

    constructor() {
        this.isAttackSpeedCooldown = false
        this.isHealCooldown = false
        this.isTeleportCooldown = false

        this.isAttackSpeedBuff = false


        this.healMesh = buildMesh(70, 70, HEALTHBAR_COLOR, new THREE.Vector2(-200, -SCENE_HEIGHT/2 + 180))
        this.attackSpeedMesh = buildMesh(70, 70, RED_COLOR, new THREE.Vector2(0, -SCENE_HEIGHT/2 + 180))
        this.teleportMesh = buildMesh(70, 70, TELEPORT_COLOR, new THREE.Vector2(200, -SCENE_HEIGHT/2 + 180))

        sceneManager.scene.add(this.attackSpeedMesh)
        sceneManager.scene.add(this.healMesh)
        sceneManager.scene.add(this.teleportMesh)

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

        window.addEventListener('click', (event: MouseEvent) => {
            this.castSpellTeleport(event)
        });

    }
    public castSpellAttackSpeed() {
        if(!this.isAttackSpeedCooldown && character.manaManager.hasEnoughMana(SPELL_AS_MANA_COST) && gameManager.gameState == GameState.RUNNING){
            playAudio(SPELL_AS)

            this.isAttackSpeedBuff = true
            character.autoAttackManager.attackSpeed /= 2
            character.autoAttackManager.attackWindup /= 2
            this.isAttackSpeedCooldown = true
            this.startAttackCooldownDisplay()

            this.isAttackSpeedBuffTimeout = setTimeout(() => {
                this.isAttackSpeedBuff = false
                character.autoAttackManager.attackSpeed *= 2
                character.autoAttackManager.attackWindup *= 2 
            }, SPELL_AS_DURATION)

            this.attackSpeedCooldownTimeout = setTimeout(() => {
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
        if(!this.isHealCooldown && character.manaManager.hasEnoughMana(SPELL_HEAL_MANA_COST) && character.healthManager.health < character.healthManager.maxHealth && gameManager.gameState == GameState.RUNNING){
            playAudio(HEAL)
            character.healthManager.updateHealth(SPELL_HEAL_VALUE)
            character.manaManager.updateMana(-SPELL_HEAL_MANA_COST)
            this.isHealCooldown = true
            this.startHealCooldownDisplay()
            this.healCooldownTimeout = setTimeout(() => {
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

    public castSpellTeleport(event: MouseEvent) {
        if(!this.isTeleportCooldown && character.manaManager.hasEnoughMana(SPELL_TELEPORT_MANA_COST) && gameManager.gameState == GameState.RUNNING){

            playAudio(TELEPORT)
            character.manaManager.updateMana(-SPELL_TELEPORT_MANA_COST)

            character.movementManager.resetMovementState()
            character.movementManager.target = convertClickToTarget(event, sceneManager)
            character.movementManager.teleportCharacter()

            this.isTeleportCooldown = true
            this.startTeleportCooldownDisplay()
            this.teleportCooldownTimeout = setTimeout(() => {
                this.isTeleportCooldown = false
            }, SPELL_TELEPORT_COOLDOWN)

        } else if(this.isTeleportCooldown){
            gameManager.writeTemporaryWarning("Spell is on cooldown")
        } else if(!character.manaManager.hasEnoughMana(SPELL_TELEPORT_MANA_COST)) {
            gameManager.writeTemporaryWarning("Not enough mana")
        }
    }

    public startHealCooldownDisplay() {
        let cooldownLeft = SPELL_HEAL_COOLDOWN / 1000
        
        buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-210, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
        .then((mesh) => {
            this.healCooldownDisplay = mesh
            sceneManager.scene.add(this.healCooldownDisplay)
        })

        this.healCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.healCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-210, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.healCooldownDisplay = mesh
                    sceneManager.scene.add(this.healCooldownDisplay)
                })
        }, 1000)

        this.healDisplayTimeout = setTimeout(() => {
            removeMesh(this.healCooldownDisplay)
            clearInterval(this.healCooldownDisplayInterval)
        }, SPELL_HEAL_COOLDOWN - 100)
    }

    public startAttackCooldownDisplay() {
        let cooldownLeft = SPELL_AS_COOLDOWN / 1000
        
        buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-10, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
        .then((mesh) => {
            this.attackSpeedCooldownDisplay = mesh
            sceneManager.scene.add(this.attackSpeedCooldownDisplay)
        })

        this.attackSpeedCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.attackSpeedCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-10, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.attackSpeedCooldownDisplay = mesh
                    sceneManager.scene.add(this.attackSpeedCooldownDisplay)
                })
        }, 1000)

        this.attackSpeedDisplayTimeout = setTimeout(() => {
            removeMesh(this.attackSpeedCooldownDisplay)
            clearInterval(this.attackSpeedCooldownDisplayInterval)
        }, SPELL_AS_COOLDOWN - 100)
    }

    public startTeleportCooldownDisplay() {
        let cooldownLeft = SPELL_TELEPORT_COOLDOWN / 1000
        
        buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(190, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
        .then((mesh) => {
            this.teleportCooldownDisplay = mesh
            sceneManager.scene.add(this.teleportCooldownDisplay)
        })

        this.teleportCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.teleportCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(190, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.teleportCooldownDisplay = mesh
                    sceneManager.scene.add(this.teleportCooldownDisplay)
                })
        }, 1000)

        this.teleportDisplayTimeout = setTimeout(() => {
            removeMesh(this.teleportCooldownDisplay)
            clearInterval(this.teleportCooldownDisplayInterval)
        }, SPELL_TELEPORT_COOLDOWN - 100)
    }

    resetSpellState() {
        clearInterval(this.healCooldownDisplayInterval)
        clearInterval(this.attackSpeedCooldownDisplayInterval)
        clearInterval(this.teleportCooldownDisplayInterval)

        removeMesh(this.healCooldownDisplay)
        removeMesh(this.attackSpeedCooldownDisplay)   
        removeMesh(this.teleportCooldownDisplay)  

        this.isAttackSpeedCooldown = false
        this.isHealCooldown = false
        this.isTeleportCooldown = false

        if(this.teleportCooldownTimeout)
            clearTimeout(this.teleportCooldownTimeout)
        if(this.healCooldownTimeout)
            clearTimeout(this.healCooldownTimeout)
        if(this.attackSpeedCooldownTimeout)
            clearTimeout(this.attackSpeedCooldownTimeout)

        if(this.teleportDisplayTimeout)
            clearTimeout(this.teleportDisplayTimeout)
        if(this.healDisplayTimeout)
            clearTimeout(this.healDisplayTimeout)
        if(this.attackSpeedDisplayTimeout)
            clearTimeout(this.attackSpeedDisplayTimeout)

        if(this.isAttackSpeedBuff && this.isAttackSpeedBuffTimeout) {
            clearInterval(this.isAttackSpeedBuffTimeout)
            character.autoAttackManager.attackSpeed *= 2
            character.autoAttackManager.attackWindup *= 2 
        }

    }
}