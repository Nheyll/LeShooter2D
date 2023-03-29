export const SCENE_WIDTH = 1600
export const SCENE_HEIGHT = 900

export const GAME_SPEED = 2;

export const PROJECTILE_SPEED = 4;
export const PROJECTILE_SIZE = 30
export const PROJECTILE_COLOR = "0xFF1493"

export const RANGEMOB_ATTACK_SPEED = 1000 //ms
export const RANGEMOB_MAX_HEALTH = 1000
export const RANGEMOB_SIZE = 100
export const RANGEMOB_SPEED = 1;
export const RANGEMOB_COLOR = "0xffff00"
export const RANGEMOB_DAMAGE = 100

export const MELEMOB_ATTACK_SPEED = 1000
export const MELEMOB_MAX_HEALTH = 2000
export const MELEMOB_SIZE = 125
export const MELEMOB_SPEED = 1;
export const MELEMOB_COLOR = "0x00FFF0"
export const MELEMOB_DAMAGE = 100

export const CHARACTER_SPEED = 5;
export const CHARACTER_ATTACK_SPEED = 400
export const CHARACTER_ATTACK_WINDUP = 200
export const CHARACTER_DAMAGE = 200
export const CHARACTER_AA_SPEED = 20 // Velocity of the AA
export const CHARACTER_MAX_HEALTH = 1000

export const HEALTHBAR_COLOR = "0x7CFC00";

export const container1Element = document.querySelector(".container1") as HTMLElement
export const startGameButtonElement = document.querySelector(".start-game-button")
export const retryButtonElement = document.querySelector(".retry-button")
export const startMenuElement = document.querySelector(".menu-start")
export const lostMenuElement = document.querySelector(".menu-lost")
export const winMenuElement = document.querySelector(".menu-win")

export const waveArray: WaveDescription[] = [
    { waveId: 1, meleMobs: 1, rangeMobs: 0 },
    { waveId: 2, meleMobs: 0, rangeMobs: 1 },
    { waveId: 3, meleMobs: 1, rangeMobs: 1 },
];
  
export interface WaveDescription {
    waveId: number
    meleMobs: number
    rangeMobs: number
}