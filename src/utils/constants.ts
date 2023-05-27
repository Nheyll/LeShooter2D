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
    { waveId: 1, meleMobs: 1, rangeMobs: 0 },
    { waveId: 1, meleMobs: 3, rangeMobs: 2 },
    { waveId: 1, meleMobs: 5, rangeMobs: 4 },
    { waveId: 1, meleMobs: 7, rangeMobs: 6 },
    { waveId: 1, meleMobs: 9, rangeMobs: 8 },
];
  
export interface WaveDescription {
    waveId: number
    meleMobs: number
    rangeMobs: number
} 