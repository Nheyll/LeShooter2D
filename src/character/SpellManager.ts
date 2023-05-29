import THREE = require("three")
import { character, gameManager, mobs, sceneManager } from ".."
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
    SPELL_TELEPORT_MANA_COST,
    AOE_COLOR,
    SPELL_AOE_MANA_COST,
    SPELL_AOE_COOLDOWN,
    CHARACTER_DAMAGE,
    SPELL_AOE_DAMAGE
} from "../utils/constants"
import { buildMesh, buildTextPromise, convertClickToTarget, isClickOnMesh, removeMesh } from "../utils/entityUtils"
import { AOE, HEAL, SPELL_AS, TELEPORT, playAudio } from "../utils/audioUtils"
import { GameState } from "../utils/enums"

export class SpellManager {
    public cursorPosition: THREE.Vector2
    public aoeSpellMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

    public isAttackSpeedCooldown: boolean
    public isHealCooldown: boolean
    public isTeleportCooldown: boolean
    public isAoeCooldown: boolean

    public healMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public attackSpeedMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public teleportMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public aoeMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

    public healCooldownDisplay: THREE.Mesh
    public attackSpeedCooldownDisplay: THREE.Mesh
    public teleportCooldownDisplay: THREE.Mesh
    public aoeCooldownDisplay: THREE.Mesh

    public attackSpeedCooldownDisplayInterval: NodeJS.Timer
    public healCooldownDisplayInterval: NodeJS.Timer
    public teleportCooldownDisplayInterval: NodeJS.Timer
    public aoeCooldownDisplayInterval: NodeJS.Timer

    public attackSpeedCooldownTimeout: NodeJS.Timeout
    public healCooldownTimeout: NodeJS.Timeout
    public teleportCooldownTimeout: NodeJS.Timeout
    public aoeCooldownTimeout: NodeJS.Timeout

    public attackSpeedDisplayTimeout: NodeJS.Timeout
    public healDisplayTimeout: NodeJS.Timeout
    public teleportDisplayTimeout: NodeJS.Timeout
    public aoeDisplayTimeout: NodeJS.Timeout

    public isAttackSpeedBuff: boolean
    public isAttackSpeedBuffTimeout: NodeJS.Timeout

    constructor() {
        this.cursorPosition = new THREE.Vector2(0,0)

        this.isAttackSpeedCooldown = false
        this.isHealCooldown = false
        this.isTeleportCooldown = false
        this.isAoeCooldown = false

        this.isAttackSpeedBuff = false


        this.healMesh = buildMesh(70, 70, HEALTHBAR_COLOR, new THREE.Vector2(-300, -SCENE_HEIGHT/2 + 180))
        this.attackSpeedMesh = buildMesh(70, 70, RED_COLOR, new THREE.Vector2(-100, -SCENE_HEIGHT/2 + 180))
        this.aoeMesh = buildMesh(70, 70, AOE_COLOR, new THREE.Vector2(100, -SCENE_HEIGHT/2 + 180))
        this.teleportMesh = buildMesh(70, 70, TELEPORT_COLOR, new THREE.Vector2(300, -SCENE_HEIGHT/2 + 180))

        sceneManager.scene.add(this.attackSpeedMesh)
        sceneManager.scene.add(this.healMesh)
        sceneManager.scene.add(this.teleportMesh)
        sceneManager.scene.add(this.aoeMesh)

        window.addEventListener('mousemove', (event: MouseEvent) => {
            this.cursorPosition.x = event.clientX;
            this.cursorPosition.y = event.clientY;
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

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'e') {
                this.castSpellTeleport()
            }
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'r') {
                this.castSpellAoe()
            }
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

    public castSpellTeleport() {
        if(!this.isTeleportCooldown && character.manaManager.hasEnoughMana(SPELL_TELEPORT_MANA_COST) && gameManager.gameState == GameState.RUNNING){

            playAudio(TELEPORT)
            character.manaManager.updateMana(-SPELL_TELEPORT_MANA_COST)

            character.movementManager.resetMovementState()
            character.movementManager.target = convertClickToTarget(new THREE.Vector2(this.cursorPosition.x,this.cursorPosition.y), sceneManager)
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

    public castSpellAoe() {
        if(!this.isAoeCooldown && character.manaManager.hasEnoughMana(SPELL_AOE_MANA_COST) && gameManager.gameState == GameState.RUNNING){

            playAudio(AOE)
            character.manaManager.updateMana(-SPELL_AOE_MANA_COST)

            let target = convertClickToTarget(this.cursorPosition,sceneManager)
            this.aoeSpellMesh = buildMesh(400, 400, AOE_COLOR, target)
            sceneManager.scene.add(this.aoeSpellMesh)
            setTimeout(() => {
                removeMesh(this.aoeSpellMesh)
            }, 50)
            mobs.forEach(m => {
                if(isClickOnMesh(new THREE.Vector2(m.mesh.position.x, m.mesh.position.y), this.aoeSpellMesh))
                    m.takeDamage(SPELL_AOE_DAMAGE)
            })

            this.isAoeCooldown = true
            this.startAoeCooldownDisplay()
            this.aoeCooldownTimeout = setTimeout(() => {
                this.isAoeCooldown = false
            }, SPELL_AOE_COOLDOWN)

        } else if(this.isAoeCooldown){
            gameManager.writeTemporaryWarning("Spell is on cooldown")
        } else if(!character.manaManager.hasEnoughMana(SPELL_AOE_MANA_COST)) {
            gameManager.writeTemporaryWarning("Not enough mana")
        }
    }

    public startHealCooldownDisplay() {
        let cooldownLeft = SPELL_HEAL_COOLDOWN / 1000
        
        buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-310, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
        .then((mesh) => {
            this.healCooldownDisplay = mesh
            sceneManager.scene.add(this.healCooldownDisplay)
        })

        this.healCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.healCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-310, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
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
        
        buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-110, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
        .then((mesh) => {
            this.attackSpeedCooldownDisplay = mesh
            sceneManager.scene.add(this.attackSpeedCooldownDisplay)
        })

        this.attackSpeedCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.attackSpeedCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(-110, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
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
        
        buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(90, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
        .then((mesh) => {
            this.teleportCooldownDisplay = mesh
            sceneManager.scene.add(this.teleportCooldownDisplay)
        })

        this.teleportCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.teleportCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(90, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
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

    public startAoeCooldownDisplay() {
        let cooldownLeft = SPELL_AOE_COOLDOWN / 1000
        
        buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(290, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
        .then((mesh) => {
            this.aoeCooldownDisplay = mesh
            sceneManager.scene.add(this.aoeCooldownDisplay)
        })

        this.aoeCooldownDisplayInterval = setInterval(() => {
            cooldownLeft--
            removeMesh(this.aoeCooldownDisplay)
            buildTextPromise(cooldownLeft.toString(), 30, new THREE.Vector2(290, -SCENE_HEIGHT/2 + 170), WHITE_COLOR)
                .then((mesh) => {
                    this.aoeCooldownDisplay = mesh
                    sceneManager.scene.add(this.aoeCooldownDisplay)
                })
        }, 1000)

        this.aoeDisplayTimeout = setTimeout(() => {
            removeMesh(this.aoeCooldownDisplay)
            clearInterval(this.aoeCooldownDisplayInterval)
        }, SPELL_AOE_COOLDOWN - 100)
    }

    resetSpellState() {
        clearInterval(this.healCooldownDisplayInterval)
        clearInterval(this.attackSpeedCooldownDisplayInterval)
        clearInterval(this.teleportCooldownDisplayInterval)
        clearInterval(this.aoeCooldownDisplayInterval)

        removeMesh(this.healCooldownDisplay)
        removeMesh(this.attackSpeedCooldownDisplay)   
        removeMesh(this.teleportCooldownDisplay)  
        removeMesh(this.aoeCooldownDisplay)  

        this.isAttackSpeedCooldown = false
        this.isHealCooldown = false
        this.isTeleportCooldown = false
        this.isAoeCooldown = false

        if(this.teleportCooldownTimeout)
            clearTimeout(this.teleportCooldownTimeout)
        if(this.healCooldownTimeout)
            clearTimeout(this.healCooldownTimeout)
        if(this.attackSpeedCooldownTimeout)
            clearTimeout(this.attackSpeedCooldownTimeout)        
        if(this.aoeCooldownTimeout)
            clearTimeout(this.aoeCooldownTimeout)

        if(this.teleportDisplayTimeout)
            clearTimeout(this.teleportDisplayTimeout)
        if(this.healDisplayTimeout)
            clearTimeout(this.healDisplayTimeout)
        if(this.attackSpeedDisplayTimeout)
            clearTimeout(this.attackSpeedDisplayTimeout)
        if(this.aoeDisplayTimeout)
            clearTimeout(this.aoeDisplayTimeout)

        if(this.isAttackSpeedBuff && this.isAttackSpeedBuffTimeout) {
            clearInterval(this.isAttackSpeedBuffTimeout)
            character.autoAttackManager.attackSpeed *= 2
            character.autoAttackManager.attackWindup *= 2 
        }

    }
}