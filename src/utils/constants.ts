export const SCENE_WIDTH = 1600
export const SCENE_HEIGHT = 900

export const GAME_SPEED = 2;

export const PROJECTILE_SPEED = 6;
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

export const CHARACTER_SPEED = 5;
export const CHARACTER_ATTACK_SPEED = 500
export const CHARACTER_ATTACK_WINDUP = 200
export const CHARACTER_DAMAGE = 300
export const CHARACTER_AA_SPEED = 10 // Velocity of the AA
export const CHARACTER_MAX_HEALTH = 1000
export const CHARACTER_MAX_MANA = 1000
export const CHARACTER_REGEN_MANA = 60 // By second

export const SPELL_AS_MANA_COST = 300
export const SPELL_AS_COOLDOWN = 9000
export const SPELL_AS_DURATION = 5000
export const SPELL_HEAL_MANA_COST = 300
export const SPELL_HEAL_VALUE = 200
export const SPELL_HEAL_COOLDOWN = 9000
export const SPELL_TELEPORT_MANA_COST = 300
export const SPELL_TELEPORT_COOLDOWN = 5000
export const SPELL_AOE_MANA_COST = 300
export const SPELL_AOE_COOLDOWN = 8000

export const CHARACTER_RIGHT_IMAGE = "./assets/texture/character-right.png"
export const CHARACTER_LEFT_IMAGE = "./assets/texture/character-left.png"
export const MOB1_IMAGE = "./assets/texture/mob1.png"
export const MOB2_IMAGE = "./assets/texture/mob2.png"
export const SCENE_BACKGROUND = './assets/texture/scene-background.png'

export const HEALTHBAR_COLOR = "0x7CFC00";
export const MANABAR_COLOR = "0x0080FF";
export const WHITE_COLOR = "0xFFFFFF"
export const RED_COLOR = "0xFF0000"
export const TELEPORT_COLOR = "0xA600A1"
export const PROJECTILE_COLOR = "0xFFFF00"
export const AUTOATTACK_COLOR = "0xFF0000"
export const AOE_COLOR = "0x6666FF"

export const TEMPORARY_MESSAGE_DURATION = 2000

export const waveArray: WaveDescription[] = [
    { waveId: 1, meleMobs: 1, rangeMobs: 0 },
    { waveId: 2, meleMobs: 0, rangeMobs: 1 },
    { waveId: 3, meleMobs: 0, rangeMobs: 3 },
    { waveId: 4, meleMobs: 2, rangeMobs: 3 },
    { waveId: 5, meleMobs: 5, rangeMobs: 3 },
    { waveId: 6, meleMobs: 0, rangeMobs: 5 },
    { waveId: 7, meleMobs: 0, rangeMobs: 7 },
    { waveId: 8, meleMobs: 0, rangeMobs: 9 },
    { waveId: 9, meleMobs: 10, rangeMobs: 0 },
    { waveId: 10, meleMobs: 60, rangeMobs: 0 },
    { waveId: 11, meleMobs: 5, rangeMobs: 9 },
    { waveId: 12, meleMobs: 0, rangeMobs: 12 },
    { waveId: 13, meleMobs: 5, rangeMobs: 12 },
    { waveId: 14, meleMobs: 12, rangeMobs: 12 },
];
  
export interface WaveDescription {
    waveId: number
    meleMobs: number
    rangeMobs: number
} 