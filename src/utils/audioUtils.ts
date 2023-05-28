export const AUDIO_BLOW1 = "./assets/audio/Blow1.wav"
export const AUDIO_BLOW2 = "./assets/audio/Blow2.wav"
export const AUDIO_BLOW5 = "./assets/audio/Blow5.wav"
export const AUDIO_BOW1 = "./assets/audio/Bow1.wav"
export const AUDIO_BOW2 = "./assets/audio/Bow2.wav"
export const DARKNESS = "./assets/audio/Darkness.wav"
export const HEAL = "./assets/audio/Heal.wav"
export const MELE_DIE = "./assets/audio/MeleDie.wav"
export const RANGE_DIE = "./assets/audio/RangeDie.wav"
export const SPELL_AS = "./assets/audio/SpellAS.wav"
export const WIN = "./assets/audio/Success.wav"
export const TELEPORT = "./assets/audio/Teleport.wav"


export function playAudio(path: string) {
    const audio = new Audio(path)
    audio.play()
}