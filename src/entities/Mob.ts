import * as THREE from 'three';
import { Vector2 } from 'three';
import { sceneManager, character, gameManager, mobs } from '../main';
import { DEFAULT_GAME_SPEED, DEFAULT_MOB_SPEED, MOB_ATTACK_SPEED, BASE_MOB_HEALTH } from '../utils/constants';
import { Projectile } from './Projectile';
import { getNextId } from '../utils/entityUtils';

export class Mob {
    id: number;
    health: number;
    isFiring: boolean;
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    public move: THREE.Vector2;
    public moveSpeed: number;

    constructor(position: THREE.Vector2) {
        const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.id = getNextId();
        this.health = BASE_MOB_HEALTH;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = position.x
        this.mesh.position.y = position.y
        this.move = new THREE.Vector2(0,0)
        this.moveSpeed = DEFAULT_MOB_SPEED + DEFAULT_GAME_SPEED
        sceneManager.scene.add(this.mesh);
        setInterval(() => {
            this.updateMoveRandomly()
        }, 1000);

        this.isFiring = true;
        
        setTimeout(() => {
            this.startFiring()
        }, 3000)
        mobs.push(this)
    }

    public updateMoveRandomly(){
        if(this.mesh.position.x > sceneManager.windowWidth / 2 -100) {
            this.move = new THREE.Vector2(-1, 0);
        } else if (this.mesh.position.x < -sceneManager.windowWidth / 2 + 100) {
            this.move = new THREE.Vector2(1, 0);
        } else if (this.mesh.position.y > sceneManager.windowHeight / 2 - 100) {
            this.move = new THREE.Vector2(0, -1);
        } else if (this.mesh.position.y < -sceneManager.windowHeight / 2 + 100) {
            this.move = new THREE.Vector2(0, 1);
        } else {
            this.move = this.generateRandomMove()
        }
        this.move = this.move.multiplyScalar(this.moveSpeed)
    }

    public generateRandomMove(){
        let x = Math.random()
        let y = 1-x;
        let oneOrTwo = Math.floor(Math.random() * 2) + 1;
        if (oneOrTwo == 1)
            y = -y
        oneOrTwo = Math.floor(Math.random() * 2) + 1;
        if(oneOrTwo == 1)
            x = -x
        return new THREE.Vector2(x,y)
    }

    public updatePosition() {
        this.mesh.position.x += this.move.x
        this.mesh.position.y += this.move.y
    }
    
    public startFiring() {
        setInterval(() => {
            this.fireProjectile()
        }, MOB_ATTACK_SPEED);
    }

    public fireProjectile() {
        if(gameManager.isGameRunning && this.isFiring)
            new Projectile(new Vector2(this.mesh.position.x, this.mesh.position.y), character.current)
    }

    public receiveProjectile(projectileDamage: number) {
        this.health = this.health - projectileDamage;
        console.log(this.health);
        if(this.health <= 0) {
        this.killMob();
        }
    }

    // Il faudra faire un truc plus propre
    killMob() {
        mobs.slice(this.id);
        this.mesh.position.x = -99999
        this.mesh.position.y = -99999
        this.isFiring = false;
    }
}