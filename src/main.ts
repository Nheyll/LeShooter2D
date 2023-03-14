import * as THREE from 'three';
import { SceneManager } from "./SceneManager";
import { Mob } from "./entities/Mob"
import { Character } from './entities/Character';
import { Projectile } from './entities/Projectile';
import { GameManager } from './GameManager';
import { retryButtonElement, startGameButtonElement } from './utils/constants';
import { AutoAttack } from './entities/Autoattack';
import { GameStateEntity, GameState } from './GameStateEntity';
import { removeMesh } from "./utils/entityUtils";

export let projectiles: Projectile[] = [];
export let mobs: Mob[] = [];
export let autoAttacks: AutoAttack[] = [];
export let  sceneManager = new SceneManager();
export let  gameStateEntity = new GameStateEntity();
export let  gameManager = new GameManager(gameStateEntity);
export let character: Character = new Character();
let mob1;
let mob2;

startGame();
animate();

/****************************************** EVENT LISTENER ************************************************/
startGameButtonElement?.addEventListener('click', () => {
    gameStateEntity.subjectGameState.next(GameState.GAME);
})

retryButtonElement?.addEventListener('click', () => {
    gameStateEntity.subjectGameState.next(GameState.START_MENU);
})

/****************************************** GAME STATE MANAGER ************************************************/
gameStateEntity.subjectGameState.subscribe((gameState: GameState) => {
    switch (gameState) {
        case GameState.START_MENU:
            menu();
            break;
        case GameState.GAME:
            startGame();
            break;
        case GameState.PAUSE:
            //pause();
            break;
        case GameState.GAME_OVER:
            //retry();
            break;
        case GameState.EXIT:
            //exit();
            break;
        case GameState.WIN:
            gameManager.onWin();
            break;
        case GameState.RETRY:
            break;
        default:
            gameStateEntity.subjectGameState.next(GameState.START_MENU);
            break;
    }
})

/****************************************** FUNCTIONS ************************************************/
function menu() {
    gameManager.startMenu();
    mob1 = new Mob(new THREE.Vector2(300,300), gameStateEntity);
    mob2 = new Mob(new THREE.Vector2(100,100), gameStateEntity);

    projectiles.forEach(p => {
        removeMesh(p.mesh)
     })
    projectiles.length = 0
    character.healthbar.health = character.healthbar.maxHealth
}

function startGame() {
    gameManager.runGame()
}

function animate() {
    projectiles.forEach((projectile, i)  => {
        projectile.updatePosition()
        projectile.checkCollision(i, character)
        projectile.checkOutOfBound(i)
    })

    autoAttacks.forEach((autoAttack, i) => {
        autoAttack.updatePosition()
        autoAttack.checkCollision(i)
    })

    character.updatePosition()
    mobs.forEach(m => {
        m.updatePosition()
    })
    requestAnimationFrame( animate )
    sceneManager.renderer.render( sceneManager.scene, sceneManager.camera )
}