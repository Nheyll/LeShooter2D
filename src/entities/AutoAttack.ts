import THREE = require("three");
import { autoAttacks, sceneManager } from "../main";
import { buildMesh, isCollision, removeMesh, updateMove } from "../utils/entityUtils";
import { Mob } from "./Mob";
import { CHARACTER_AA_SPEED, DEFAULT_GAME_SPEED } from "../utils/constants"
import { MeshEntity } from "../MeshEntity";

export class AutoAttack extends MeshEntity {
    public target: Mob
    public move: THREE.Vector2
    public moveSpeed: number

    constructor(mob: Mob, source:THREE.Vector2) {
        super(buildMesh(30,30,"0x9933FF", new THREE.Vector2(source.x, source.y)))
        this.target = mob
        this.moveSpeed = CHARACTER_AA_SPEED * DEFAULT_GAME_SPEED
        this.move = new THREE.Vector2(0,0)
        sceneManager.scene.add(this.mesh); 
    }

    public checkCollision(i:number) {
        if(isCollision(this.mesh, this.target.mesh)){
            autoAttacks.splice(i, 1)
            removeMesh(this.mesh)
            this.target.takeDamage()
        }
    }

    public updatePosition() {
        updateMove(new THREE.Vector2(this.mesh.position.x, this.mesh.position.y), new THREE.Vector2(this.target.mesh.position.x, this.target.mesh.position.y), this.move, this.moveSpeed)
        this.mesh.position.x += this.move.x
        this.mesh.position.y += this.move.y
    }
}