import { Direction } from "../utils/enums"
import * as THREE from "three"
import { autoAttacks, mobs, sceneManager } from "../main"
import { GAME_SPEED, CHARACTER_SPEED, CHARACTER_ATTACK_SPEED, CHARACTER_ATTACK_WINDUP, CHARACTER_DAMAGE } from "../utils/constants"
import { buildMesh, isClickOnMesh, updateMove, convertClickToTarget, isClickOnCanvas } from "../utils/entityUtils"
import { Healthbar } from "../layout/Healthbar"
import { Mob } from "./Mob"
import { AutoAttack } from "./Autoattack"
import { MeshEntity } from "../MeshEntity"
import { Vector2 } from "three"

export class Character extends MeshEntity {
    public move: THREE.Vector2
    public current: THREE.Vector2
    public target: THREE.Vector2
    public moveDirection: string
    public moveSpeed: number
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public healthbar: Healthbar
    public isAutoAttacking: boolean
    public isAutoAttackCooldown: boolean
    public focus: Mob

    constructor() {
        super(buildMesh(100, 100, "0xff0000", new Vector2(-100, -100)))
        this.healthbar = new Healthbar()
        this.move = new THREE.Vector2(0, 0);
        this.current = new THREE.Vector2(0, 0);
        this.target = new THREE.Vector2(0, 0);
        this.moveDirection = Direction.NOT_MOVING;
        this.moveSpeed = GAME_SPEED * CHARACTER_SPEED
        this.isAutoAttacking = false
        this.isAutoAttackCooldown = false
        sceneManager.scene.add( this.mesh );
        window.addEventListener('contextmenu', (event) => {
            this.onRightClick(event);
        });
    }

    public onRightClick(event: MouseEvent) {
        if(!isClickOnCanvas(event)){
            return
        }
        this.target = convertClickToTarget(event, sceneManager);
        let flagFocus = false
        for(let i = 0; i < mobs.length; i++) {
            if(isClickOnMesh(this.target, mobs[i].mesh)){
                this.focus = mobs[i]
                flagFocus = true
                break
            }
        }
        if(flagFocus == false) {
            this.focus = null
            this.onMove()
        } else if(this.moveDirection != Direction.AA) {
            this.moveDirection = Direction.AA
            this.move.set(0,0)
            this.onAutoAttack()
        }
    }

    public onAutoAttack() {
        this.moveDirection = Direction.AA
        this.move.set(0,0)
        this.isAutoAttacking = true
        
        if(!this.isAutoAttackCooldown) {
            this.startAutoAttack()
        } else {
            const intervalId = setInterval(() => {
                if(!this.isAutoAttacking){
                    clearInterval(intervalId)
                }
                if(!this.isAutoAttackCooldown){
                    this.startAutoAttack()
                    clearInterval(intervalId)
                }
            }, 10);            
        }
    }

    public startAutoAttack() {
        let windup = true
        let count = 0;
        const intervalId = setInterval(() => {
            count++
            if(!this.isAutoAttacking)
                windup = false
            if (count >= CHARACTER_ATTACK_WINDUP / 20) {
                clearInterval(intervalId)
            }
        }, 20);

        setTimeout(() => {
            if(windup)
                this.fireAutoAttack()
        }, CHARACTER_ATTACK_WINDUP)
    }

    public fireAutoAttack() {
        let autoAttack = new AutoAttack(this.focus, this.current)
        autoAttacks.push(autoAttack)
        this.isAutoAttackCooldown = true

        let stillAutoAttacking = true

        if(this.focus.health - CHARACTER_DAMAGE <= 0) {
            if(mobs.indexOf(this.focus) != 0){
                this.focus = mobs[0]
            } else if(mobs.length > 1) {
                this.focus = mobs[1]
            } else {
                this.focus = null
                this.isAutoAttacking = false
            }
        }

        let count = 0;
        const intervalId = setInterval(() => {
            count++
            if(!this.isAutoAttacking) {
                stillAutoAttacking = false
            }
            if (count >= CHARACTER_ATTACK_SPEED / 20) {
                clearInterval(intervalId)
            }
        }, 20);

        setTimeout(() => {
            this.isAutoAttackCooldown = false
            if(stillAutoAttacking)
                this.onAutoAttack()
        }, CHARACTER_ATTACK_SPEED)
    }

    public onMove() {
        this.isAutoAttacking = false
        this.setDirection();
        updateMove(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), this.target, this.move, this.moveSpeed)
    }

    public setDirection() {
        if(this.target.x > this.current.x){
            if(this.target.y > this.current.y) {
                this.moveDirection = Direction.NE;
            }else{
                this.moveDirection = Direction.SE;
            }
        } else {
            if(this.target.y > this.current.y) {
                this.moveDirection = Direction.NW;
            }else{
                this.moveDirection = Direction.SW;
            }
        }
    }

    public updatePosition() {
        if (this.moveDirection == Direction.NE && (this.current.x+this.move.x > this.target.x || this.current.y+this.move.y > this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        } else if (this.moveDirection == Direction.NW && (this.current.x+this.move.x < this.target.x || this.current.y+this.move.y > this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        } else if (this.moveDirection == Direction.SE && (this.current.x+this.move.x > this.target.x || this.current.y+this.move.y < this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        } else if (this.moveDirection == Direction.SW && (this.current.x+this.move.x < this.target.x || this.current.y+this.move.y < this.target.y)){
            this.moveDirection = Direction.NOT_MOVING;
        }
    
        if(this.moveDirection != Direction.NOT_MOVING){
            this.current.set(this.current.x + this.move.x, this.current.y + this.move.y);
            this.mesh.position.x = this.current.x;
            this.mesh.position.y = this.current.y;
        } else {
            this.current.set(this.target.x, this.target.y);
            this.mesh.position.x = this.target.x;
            this.mesh.position.y = this.target.y;
        }
    }
}