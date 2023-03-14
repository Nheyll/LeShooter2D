import * as THREE from 'three';
import { Vector2 } from 'three';
import { sceneManager, character, gameManager, mobs } from '../main';
import { DEFAULT_GAME_SPEED, DEFAULT_MOB_SPEED, MOB_ATTACK_SPEED, BASE_MOB_HEALTH } from '../utils/constants';
import { Projectile } from './Projectile';
import { getNextId, removeMesh } from '../utils/entityUtils';

export class Mob {
    id: number;
    health: number;
    firingIntervalTimer;
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    public move: THREE.Vector2;
    public moveSpeed: number;

    constructor(position: THREE.Vector2) {
        this.id = getNextId();
        this.health = BASE_MOB_HEALTH;

        const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.move = new THREE.Vector2(0,0);
        this.moveSpeed = DEFAULT_MOB_SPEED + DEFAULT_GAME_SPEED;

        this.startInteracting();

        sceneManager.scene.add(this.mesh);
        mobs.push(this);
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
        this.move = this.move.multiplyScalar(this.moveSpeed);
    }

    public updatePosition() {
        this.mesh.position.x += this.move.x;
        this.mesh.position.y += this.move.y;
    }

    public receiveProjectile(projectileDamage: number) {
        this.health = this.health - projectileDamage;
        if(this.health <= 0) {
            this.killMob();
        }
    }

    startInteracting() {
        this.firingIntervalTimer = setInterval(() => {
            this.fireProjectile()
        }, MOB_ATTACK_SPEED);
        setInterval(() => {
            this.updateMoveRandomly()
        }, 1000);
    }

    fireProjectile() {
        if(gameManager.isGameRunning) {
            new Projectile(new Vector2(this.mesh.position.x, this.mesh.position.y), character.current)
        }
    }

    generateRandomMove(){
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

    killMob() {
        const index = mobs.findIndex((mob) => mob.id === this.id);

        mobs.splice(index, 1);
        removeMesh(this.mesh);
        clearInterval(this.firingIntervalTimer);
    }
}