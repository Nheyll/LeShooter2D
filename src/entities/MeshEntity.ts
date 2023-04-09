import * as THREE from "three"

export class MeshEntity {
    public mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>

    constructor(mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>){
        this.mesh = mesh
    }
}