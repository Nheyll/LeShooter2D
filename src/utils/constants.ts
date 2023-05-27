export const SCENE_WIDTH = 1600
export const SCENE_HEIGHT = 900

export const GAME_SPEED = 2;

export const PROJECTILE_SPEED = 8;
export const PROJECTILE_SIZE = 30

export const RANGEMOB_ATTACK_SPEED = 2000 //ms
export const RANGEMOB_MAX_HEALTH = 1000
export const RANGEMOB_SIZE = 100
export const RANGEMOB_SPEED = 1;
export const RANGEMOB_DAMAGE = 50

export const MELEMOB_ATTACK_SPEED = 1000
export const MELEMOB_MAX_HEALTH = 1000
export const MELEMOB_SIZE = 125
export const MELEMOB_SPEED = 1;
export const MELEMOB_DAMAGE = 50

export const CHARACTER_SPEED = 4;
export const CHARACTER_ATTACK_SPEED = 500
export const CHARACTER_ATTACK_WINDUP = 200
export const CHARACTER_DAMAGE = 300
export const CHARACTER_AA_SPEED = 10 // Velocity of the AA
export const CHARACTER_MAX_HEALTH = 1000
export const CHARACTER_MAX_MANA = 1000
export const CHARACTER_REGEN_MANA = 20 // By second

export const SPELL_AS_MANA_COST = 300
export const SPELL_AS_COOLDOWN = 10000
export const SPELL_AS_DURATION = 5000
export const SPELL_HEAL_MANA_COST = 300
export const SPELL_HEAL_VALUE = 200
export const SPELL_HEAL_COOLDOWN = 10000

export const CHARACTER_RIGHT_IMAGE = "./assets/texture/character-right.png"
export const CHARACTER_LEFT_IMAGE = "./assets/texture/character-left.png"
export const MOB1_IMAGE = "./assets/texture/mob1.png"
export const MOB2_IMAGE = "./assets/texture/mob2.png"
export const SCENE_BACKGROUND = './assets/texture/scene-background.png'

export const HEALTHBAR_COLOR = "0x7CFC00";
export const MANABAR_COLOR = "0x0080FF";
export const WHITE_COLOR = "0xFFFFFF"
export const RED_COLOR = "0xFF0000"
export const PROJECTILE_COLOR = "0xFFFF00"
export const AUTOATTACK_COLOR = "0xFF0000"

export const TEMPORARY_MESSAGE_DURATION = 2000

export const waveArray: WaveDescription[] = [
    { waveId: 1, meleMobs: 0, rangeMobs: 1 },
    { waveId: 2, meleMobs: 1, rangeMobs: 1 },
    { waveId: 3, meleMobs: 1, rangeMobs: 2 },
    { waveId: 4, meleMobs: 2, rangeMobs: 2 },
    { waveId: 5, meleMobs: 2, rangeMobs: 3 },
    { waveId: 6, meleMobs: 3, rangeMobs: 3 },
    { waveId: 7, meleMobs: 3, rangeMobs: 4 },
    { waveId: 8, meleMobs: 4, rangeMobs: 4 },
    { waveId: 9, meleMobs: 0, rangeMobs: 6 },
    { waveId: 10, meleMobs: 0, rangeMobs: 8 },
    { waveId: 11, meleMobs: 0, rangeMobs: 10 },
    { waveId: 12, meleMobs: 5, rangeMobs: 0 },
    { waveId: 13, meleMobs: 7, rangeMobs: 0 },
    { waveId: 14, meleMobs: 9, rangeMobs: 0 },
    { waveId: 15, meleMobs: 4, rangeMobs: 5 },
    { waveId: 16, meleMobs: 5, rangeMobs: 5 },
    { waveId: 17, meleMobs: 5, rangeMobs: 6 },
    { waveId: 18, meleMobs: 6, rangeMobs: 6 },
    { waveId: 19, meleMobs: 6, rangeMobs: 7 },
    { waveId: 20, meleMobs: 7, rangeMobs: 7 },
    { waveId: 21, meleMobs: 7, rangeMobs: 8 },
    { waveId: 22, meleMobs: 8, rangeMobs: 8 },
    { waveId: 23, meleMobs: 8, rangeMobs: 9 },
    { waveId: 24, meleMobs: 9, rangeMobs: 9 },
    { waveId: 25, meleMobs: 9, rangeMobs: 10 },
    { waveId: 26, meleMobs: 10, rangeMobs: 10 },

];
  
export interface WaveDescription {
    waveId: number
    meleMobs: number
    rangeMobs: number
} 