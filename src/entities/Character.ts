import { Direction } from "../utils/enums"
import * as THREE from "three"
import { sceneManager } from "../main"
import { DEFAULT_GAME_SPEED, DEFAULT_CHARACTER_SPEED } from "../utils/constants"
import { updateMove } from "../utils/entityUtils"

export class Character {
    public move: THREE.Vector2
    public current: THREE.Vector2
    public target: THREE.Vector2
    public moveDirection: string
    public moveSpeed: number
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
    public health: number

    constructor() {
        this.move = new THREE.Vector2(0, 0);
        this.current = new THREE.Vector2(0, 0);
        this.target = new THREE.Vector2(0, 0);
        this.moveDirection = Direction.NOT_MOVING;
        this.moveSpeed = DEFAULT_GAME_SPEED * DEFAULT_CHARACTER_SPEED
        const geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
        this.mesh = new THREE.Mesh( geometry, material );
        sceneManager.scene.add( this.mesh );
        window.addEventListener('contextmenu', (event) => {
            this.onMove(event);
        });
    }

    public onMove(event: MouseEvent) {
        this.target.set(event.clientX - sceneManager.windowWidth/2, -event.clientY + sceneManager.windowHeight/2);
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