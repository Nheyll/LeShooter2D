export const SCENE_WIDTH = 1600
export const SCENE_HEIGHT = 900

export const GAME_SPEED = 2;

export const PROJECTILE_SPEED = 6;
export const PROJECTILE_SIZE = 30
export const PROJECTILE_COLOR = "0xFF1493"

export const RANGEMOB_ATTACK_SPEED = 2000 //ms
export const RANGEMOB_MAX_HEALTH = 1000
export const RANGEMOB_SIZE = 100
export const RANGEMOB_SPEED = 1;
export const RANGEMOB_COLOR = "0xffff00"
export const RANGEMOB_DAMAGE = 1

export const MELEMOB_ATTACK_SPEED = 1000
export const MELEMOB_MAX_HEALTH = 1000
export const MELEMOB_SIZE = 125
export const MELEMOB_SPEED = 1;
export const MELEMOB_COLOR = "0x00FFF0"
export const MELEMOB_DAMAGE = 0

export const CHARACTER_SPEED = 5;
export const CHARACTER_ATTACK_SPEED = 500
export const CHARACTER_ATTACK_WINDUP = 100
export const CHARACTER_DAMAGE = 200
export const CHARACTER_AA_SPEED = 2 // Velocity of the AA
export const CHARACTER_MAX_HEALTH = 1000
export const CHARACTER_MAX_MANA = 1000
export const CHARACTER_REGEN_MANA = 20 // By second

export const SPELL_AS_MANA_COST = 300
export const SPELL_AS_COOLDOWN = 10000
export const SPELL_AS_DURATION = 5000
export const SPELL_HEAL_MANA_COST = 300
export const SPELL_HEAL_VALUE = 200
export const SPELL_HEAL_COOLDOWN = 10000

export const CHARACTER_COLOR = "0xff0000"
export const HEALTHBAR_COLOR = "0x7CFC00";
export const MANABAR_COLOR = "0x0080FF";
export const WHITE_COLOR = "0xFFFFFF"
export const RED_COLOR = "0xFF0000"

export const TEMPORARY_MESSAGE_DURATION = 2000

export const container1Element = document.querySelector(".container1") as HTMLElement
export const startGameButtonElement = document.querySelector(".start-game-button")
export const retryButtonLostElement = document.querySelector(".retry-button-lost")
export const retryButtonWinElement = document.querySelector(".retry-button-win")
export const startMenuElement = document.querySelector(".menu-start")
export const lostMenuElement = document.querySelector(".menu-lost")
export const winMenuElement = document.querySelector(".menu-win")

export const waveArray: WaveDescription[] = [
    { waveId: 1, meleMobs: 0, rangeMobs: 1 },
];
  
export interface WaveDescription {
    waveId: number
    meleMobs: number
    rangeMobs: number
}