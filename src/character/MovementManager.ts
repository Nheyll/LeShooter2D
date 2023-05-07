import THREE = require("three")
import { GAME_SPEED, CHARACTER_SPEED, CHARACTER_RIGHT_IMAGE, CHARACTER_LEFT_IMAGE } from "../utils/constants"
import { Direction } from "../utils/enums"
import { character } from ".."
import { updateMove, updateTexture } from "../utils/entityUtils"

export class MovementManager {
    public move: THREE.Vector2
    public current: THREE.Vector2
    public target: THREE.Vector2
    public moveDirection: string
    public moveSpeed: number

    constructor() {
        this.move = new THREE.Vector2(0, 0);
        this.current = new THREE.Vector2(0, 0);
        this.target = new THREE.Vector2(0, 0);
        this.moveDirection = Direction.NOT_MOVING;
        this.moveSpeed = GAME_SPEED * CHARACTER_SPEED
    }

    public onMove() {
        character.autoAttackManager.isAutoAttacking = false
        this.setDirection();
        updateMove(new THREE.Vector2(character.mesh.position.x, character.mesh.position.y), this.target, this.move, this.moveSpeed)
    }

    public setDirection() {
        this.updateCharacterOrientation()
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

    public updateCharacterOrientation() {
        if(this.target.x > this.current.x){
            updateTexture(character.mesh, CHARACTER_RIGHT_IMAGE)
        } else {
            updateTexture(character.mesh, CHARACTER_LEFT_IMAGE)
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
            character.mesh.position.x = this.current.x;
            character.mesh.position.y = this.current.y;
        } else {
            this.current.set(this.target.x, this.target.y);
            character.mesh.position.x = this.target.x;
            character.mesh.position.y = this.target.y;
        }
    }

    public resetMovementState() {
        this.moveDirection = Direction.NOT_MOVING;
    }
}