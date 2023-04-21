import { Mob } from "../entities/Mob"
import { CHARACTER_ATTACK_SPEED, CHARACTER_ATTACK_WINDUP } from "../utils/constants"
import { autoAttacks, character } from ".."
import { Direction } from "../utils/enums"
import { AutoAttack } from "./AutoAttack"

export class AutoAttackManager {
    public isAutoAttacking: boolean
    public isAutoAttackCooldown: boolean
    public focus: Mob
    public attackWindup: number
    public attackSpeed: number
    
    constructor() {
        this.isAutoAttacking = false
        this.isAutoAttackCooldown = false
        this.attackSpeed = CHARACTER_ATTACK_SPEED
        this.attackWindup = CHARACTER_ATTACK_WINDUP
    }

    public onAutoAttack() {
        character.movementManager.moveDirection = Direction.AA
        character.movementManager.move.set(0,0)
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
        }, this.attackWindup)
    }

    public fireAutoAttack() {
        let autoAttack = new AutoAttack(this.focus, character.movementManager.current)
        autoAttacks.push(autoAttack)
        this.isAutoAttackCooldown = true

        let stillAutoAttacking = true

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
        }, this.attackSpeed)
    }

    public resetAutoAttackState() {
        this.isAutoAttacking = false
        this.isAutoAttackCooldown = false 
    }
}