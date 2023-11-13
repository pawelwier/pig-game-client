import { writable } from 'svelte/store'

export const gameStore = writable(null)
export const playerStore = writable(null)
export const scoreStore = writable(null)
export const gameStateStore = writable(null)