import * as THREE from 'three';
import { SceneManager } from "./SceneManager";
import { Mob } from "./entities/Mob"
import { Character } from './entities/Character';
import { Projectile } from './entities/Projectile';

export let projectiles: Projectile[] = []
export const sceneManager = new SceneManager()
const mob = new Mob(new THREE.Vector2(100,100))
export const character = new Character()



function animate() {
    projectiles.forEach((projectile, i)  => {
        projectile.updatePosition()
        projectile.checkCollision(i, character)
        projectile.checkOutOfBound(i)
    })
    character.updatePosition()
    mob.updatePosition()
    requestAnimationFrame( animate )
    sceneManager.renderer.render( sceneManager.scene, sceneManager.camera )
}
animate()