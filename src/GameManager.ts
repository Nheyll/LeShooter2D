import THREE = require("three");
import { MeleMob } from "./entities/MeleMob";
import { RangeMob } from "./entities/RangeMob";
import { character, mobs, projectiles, sceneManager } from "./main";
import { container1Element, lostMenuElement, RED_COLOR, SCENE_HEIGHT, startMenuElement, TEMPORARY_MESSAGE_DURATION, waveArray, WaveDescription, WHITE_COLOR, winMenuElement } from "./utils/constants";
import { buildTextPromise, removeMesh } from "./utils/entityUtils";
import { GameState } from "./utils/enums";

export class GameManager {
    public gameState: string
    public audio: any
    public waveDescriptionArray: WaveDescription[]
    public waveCount: THREE.Mesh
    public warning: THREE.Mesh
    public warningTimeout: NodeJS.Timeout
    public checkGameStateInterval: NodeJS.Timer

    constructor(){
        this.gameState = GameState.RUNNING
        this.audio = new Audio('../assets/audio/jul.mp3'); 
        this.waveDescriptionArray = waveArray
    }

    public runGame() {
        container1Element.classList.toggle('hide-element', false)
        startMenuElement.classList.toggle('hide-element', true)
        lostMenuElement.classList.toggle('hide-element', true)
        winMenuElement.classList.toggle('hide-element', true)
        this.resetGame()
        this.startWaves()
    }
    
    public startWaves() {
        this.gameState = GameState.RUNNING
        let indexWave = 0;
        this.checkGameStateInterval = setInterval(() => {
            if(mobs.length == 0 && this.waveDescriptionArray.length >= indexWave+1) {
                this.startWave(this.waveDescriptionArray[indexWave])
                indexWave++
            } else if (mobs.length == 0 && this.waveDescriptionArray.length < indexWave+1) {
                this.onWin()
                this.gameState = GameState.WON
                clearInterval(this.checkGameStateInterval)
            } else if (character.healthManager.health <= 0) {
                this.onLost()
                this.gameState = GameState.LOST
                clearInterval(this.checkGameStateInterval)
            }
        }, 250);
        
    }

    public startWave(waveDescription: WaveDescription) {
        removeMesh(this.waveCount)
        buildTextPromise("Wave " + waveDescription.waveId +" out of " + this.waveDescriptionArray.length, 30, new THREE.Vector2(-100, SCENE_HEIGHT / 2 - 50), WHITE_COLOR)
        .then((mesh) => {
            this.waveCount = mesh
            sceneManager.scene.add(this.waveCount)
        })  

        for(let i = 0; i < waveDescription.meleMobs; i++) {
            new MeleMob(new THREE.Vector2(Math.floor(Math.random() * 1601) - 800, Math.floor(Math.random() * 901) - 450))
        }

        for(let i = 0; i < waveDescription.rangeMobs; i++) {
            new RangeMob(new THREE.Vector2(Math.floor(Math.random() * 1601) - 800, Math.floor(Math.random() * 901) - 450))
        }
    }

    public onLost() {
        container1Element.classList.toggle('hide-element', true)
        lostMenuElement.classList.toggle('hide-element', false)
    }

    public onWin() {
        container1Element.classList.toggle('hide-element', true)
        winMenuElement.classList.toggle('hide-element', false)
    }

    public resetGame() {
        mobs.forEach(m => {
            m.die()
        })
        mobs.length = 0
        removeMesh(this.waveCount)
        projectiles.forEach(p => {
            removeMesh(p.mesh)
        })
        projectiles.length = 0
        character.resetState()
    }

    public writeTemporaryWarning(text: string) {
        clearTimeout(this.warningTimeout);
        removeMesh(this.warning)
        buildTextPromise(text, 20, new THREE.Vector2(0 - text.length * 5, -SCENE_HEIGHT / 2 + 150), RED_COLOR)        
        .then((mesh) => {
            this.warning = mesh
            sceneManager.scene.add(this.warning)
            this.warningTimeout = setTimeout(() => {
                removeMesh(this.warning)
                this.warning = null;
            }, TEMPORARY_MESSAGE_DURATION)
        }) 
    }
}