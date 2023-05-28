import THREE = require("three");
import { MeleMob } from "./entities/MeleMob";
import { RangeMob } from "./entities/RangeMob";
import { character, mobs, projectiles, sceneManager } from ".";
import { RED_COLOR, SCENE_HEIGHT, TEMPORARY_MESSAGE_DURATION, waveArray, WaveDescription, WHITE_COLOR } from "./utils/constants";
import { buildTextPromise, removeMesh } from "./utils/entityUtils";
import { GameState } from "./utils/enums";
import { DARKNESS, WIN, playAudio } from "./utils/audioUtils";
import { arrowBackElement, backMenuLostElement, backMenuWinElement, container1Element, controlsButtonElement, controlsMenuElement, easyButtonElement, hardButtonElement, impossibleButtonElement, lostMenuElement, mediumButtonElement, retryButtonLostElement, retryButtonWinElement, startMenuElement, winMenuElement } from "./utils/querySelectors";

export class GameManager {
    public gameState: string
    public waveDescriptionArray: WaveDescription[]
    public waveCount: THREE.Mesh
    public warning: THREE.Mesh
    public warningTimeout: NodeJS.Timeout
    public checkGameStateInterval: NodeJS.Timer
    public difficultyMultiplier: number

    constructor(){
        this.gameState = GameState.MENU
        this.waveDescriptionArray = waveArray
        
        easyButtonElement?.addEventListener('click', () => {
            this.difficultyMultiplier = 1
            this.runGame()
        })

        mediumButtonElement?.addEventListener('click', () => {
            this.difficultyMultiplier = 2
            this.runGame()
        })

        hardButtonElement?.addEventListener('click', () => {
            this.difficultyMultiplier = 4
            this.runGame()
        })

        impossibleButtonElement?.addEventListener('click', () => {
            this.difficultyMultiplier = 100
            this.runGame()
        })

        retryButtonWinElement?.addEventListener('click', () => {
            this.runGame()
        })
        
        retryButtonLostElement?.addEventListener('click', () => {
            this.runGame()
        })
        
        controlsButtonElement?.addEventListener('click', () => {
            this.showControls()
        })

        arrowBackElement?.addEventListener('click', () => {
            this.returnToStartMenu()
        })

        backMenuWinElement?.addEventListener('click', () => {
            this.returnToStartMenu()
        })

        backMenuLostElement?.addEventListener('click', () => {
            this.returnToStartMenu()
        })
    }

    public runGame() {
        container1Element.classList.toggle('hide-element', false)
        startMenuElement.classList.toggle('hide-element', true)
        lostMenuElement.classList.toggle('hide-element', true)
        winMenuElement.classList.toggle('hide-element', true)
        setTimeout(() => {
            this.gameState = GameState.RUNNING
            this.resetGame()
            this.checkGameState()
        }, 50)
    }
    
    public checkGameState() {
        this.gameState = GameState.RUNNING
        let indexWave = 0;
        this.checkGameStateInterval = setInterval(() => {
            if(mobs.length == 0 && this.waveDescriptionArray.length >= indexWave+1) {
                this.resetGame()
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
        playAudio(DARKNESS)
        this.resetGame()
        container1Element.classList.toggle('hide-element', true)
        lostMenuElement.classList.toggle('hide-element', false)
    }

    public onWin() {
        playAudio(WIN)
        this.resetGame()
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

    public showControls() {
        startMenuElement.classList.toggle('hide-element', true)
        controlsMenuElement.classList.toggle('hide-element', false)
    }

    public returnToStartMenu() {
        startMenuElement.classList.toggle('hide-element', false)
        lostMenuElement.classList.toggle('hide-element', true)
        winMenuElement.classList.toggle('hide-element', true)
        controlsMenuElement.classList.toggle('hide-element', true)
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