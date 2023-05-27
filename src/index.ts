import { SceneManager } from "./SceneManager";
import { Mob } from "./entities/Mob"
import { Character } from './character/Character';
import { Projectile } from './entities/Projectile';
import { GameManager } from './GameManager';
import { AutoAttack } from './character/AutoAttack';
import "./style.css";

export let projectiles: Projectile[] = []
export let mobs: Mob[] = []
export let autoAttacks: AutoAttack[] = []
export const sceneManager = new SceneManager()
export const gameManager = new GameManager()
export const character = new Character()


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

    character.movementManager.updatePosition()
    mobs.forEach(m => {
        m.updatePosition()
        m.checkCollision()
    })
    requestAnimationFrame( animate )
    sceneManager.renderer.render( sceneManager.scene, sceneManager.camera )
}
animate()