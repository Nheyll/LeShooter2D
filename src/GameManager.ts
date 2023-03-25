import { character, projectiles } from "./main";
import { container1Element, lostMenuElement, startMenuElement, winMenuElement } from "./utils/constants";
import { removeMesh } from "./utils/entityUtils";

export class GameManager {
    public isGameRunning: boolean
    public audio: any

    constructor(){
        this.isGameRunning = false
        this.audio = new Audio('../assets/audio/jul.mp3');
    }

    public runGame() {
        container1Element.classList.toggle('hide-element', false)
        startMenuElement.classList.toggle('hide-element', true)
        lostMenuElement.classList.toggle('hide-element', true)
        winMenuElement.classList.toggle('hide-element', true)
        this.isGameRunning = true
        this.audio.pause()
        this.audio = new Audio('../assets/audio/jul.mp3');
        this.audio.play();
    }

    public onLost() {
        this.isGameRunning = false
        this.resetGame()
        container1Element.classList.toggle('hide-element', true)
        lostMenuElement.classList.toggle('hide-element', false)
        this.audio.pause()
        this.audio = new Audio('../assets/audio/wejdene.mp3');
        this.audio.play();
    }

    public resetGame() {
        projectiles.forEach(p => {
            removeMesh(p.mesh)
        })
        projectiles.length = 0
        character.healthbar.health = character.healthbar.maxHealth
    }
}