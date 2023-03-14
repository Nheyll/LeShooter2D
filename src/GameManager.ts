import { character, projectiles } from "./main";
import { canvasElement, lostMenuElement, startMenuElement, winMenuElement, visualElementList } from "./utils/constants";
import { removeMesh } from "./utils/entityUtils";
import { GameStateEntity, GameState } from './GameStateEntity';

export class GameManager {
    public isGameRunning: boolean
    public audio: any

    constructor(private gameStateEntity: GameStateEntity){
        this.audio = new Audio();
    }

    public startMenu() {
        this.loadVisualElement(startMenuElement);
        this.isGameRunning = false
    }

    public runGame() {
        this.loadVisualElement(canvasElement);
        this.isGameRunning = true
        this.audio.pause()
        //this.audio = new Audio('../assets/audio/jul.mp3');
        //this.audio.play();
    }

    public onLost() {
        this.loadVisualElement(lostMenuElement);
        this.gameStateEntity.subjectGameState.next(GameState.RETRY);
        this.isGameRunning = false
        //this.audio.pause()
        //this.audio = new Audio('../assets/audio/wejdene.mp3');
        //this.audio.play();
    }

    public onWin() {
        this.loadVisualElement(winMenuElement);
        this.gameStateEntity.subjectGameState.next(GameState.START_MENU);
    }

    loadVisualElement(self) {
        for (var visualElement of visualElementList) {
            visualElement.classList.toggle('hide-element', self !== visualElement);
        }
    }
}