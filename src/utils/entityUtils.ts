import * as THREE from "three"
import { sceneManager } from "../main";

export var nextId = 0;

export function updateMove(source: THREE.Vector2, target: THREE.Vector2, move: THREE.Vector2, moveSpeed: number) {
    let dist = new THREE.Vector2(source.x-target.x, source.y-target.y);
    if(dist.x != 0 && dist.y != 0) {
        let ratio = Math.abs(dist.x/dist.y);
        move.setX(ratio / (1 + ratio) * moveSpeed);
        move.setY(moveSpeed - move.x);
    } else if (dist.x == 0 && dist.y != 0) {
        move.set(0, moveSpeed);
    } else if (dist.x != 0 && dist.y == 0) {
        move.set(moveSpeed, 0);
    } else {
        move.set(0, 0);
    }
    if(dist.x > 0)
        move.setX(-move.x);
    if(dist.y > 0)
        move.setY(-move.y);
}

export function removeMesh(mesh: THREE.Mesh | undefined) {
    if (!mesh) return
    sceneManager.scene.remove(mesh);
    mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose())
    } else {
        mesh.material.dispose();
    }
}

export function isCollision(object1: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>, object2: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>) {
    let minX1 = object1.position.x - (object1.geometry.parameters.width/2);
    let maxX1 = object1.position.x + (object1.geometry.parameters.width/2);
    let minY1 = object1.position.y - (object1.geometry.parameters.height/2);
    let maxY1 = object1.position.y + (object1.geometry.parameters.height/2);

    let minX2 = object2.position.x - (object2.geometry.parameters.width/2);
    let maxX2 = object2.position.x + (object2.geometry.parameters.width/2);
    let minY2 = object2.position.y - (object2.geometry.parameters.height/2);
    let maxY2 = object2.position.y + (object2.geometry.parameters.height/2);

    return minX1 <= maxX2 && maxX1 >= minX2 && minY1 <= maxY2 && maxY1 >= minY2
} 

export function isClickOnMesh(target: THREE.Vector2, mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>) {
    let minX1 = mesh.position.x - (mesh.geometry.parameters.width/2);
    let maxX1 = mesh.position.x + (mesh.geometry.parameters.width/2);
    let minY1 = mesh.position.y - (mesh.geometry.parameters.height/2);
    let maxY1 = mesh.position.y + (mesh.geometry.parameters.height/2);
    if(target.x < maxX1 && target.x > minX1 && target.y < maxY1 && target.y > minY1) {
        return true
    }
}

export function isOutOfBound(mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>) {
    let size = mesh.geometry.parameters.width
    return mesh.position.x - size / 2 > sceneManager.camera.right ||
    mesh.position.x + size / 2 < sceneManager.camera.left ||
    mesh.position.y - size / 2 > sceneManager.camera.top ||
    mesh.position.y + size / 2 < sceneManager.camera.bottom
}

export function getNextId() {
    nextId++;
    return nextId;
    }