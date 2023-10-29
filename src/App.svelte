<script>
import { onMount } from "svelte";
import { client } from './websockets/connection'
import GameData from "./components/GameData.svelte"
import Dice from "./components/dice/Dice.svelte"
import { MessageTypes, getRandomResult } from "./utils"
import MainButton from "./components/MainButton.svelte"
import ScoreBoard from "./components/ScoreBoard.svelte"

// TODO: refactor App
// TODO: make reactive

$: canTake = !!score // TODO: edit
$: canRoll = !result || resultSelected

let result, score, gameState, current
let playerList = []
let resultSelected = false

const gameId = '653051016876cce8ad74c300' // TODO: set dynamic 
const onStart = e => { console.log('start') }
const sendResult = () => {
	result = getRandomResult()
	client.send(JSON.stringify({
		type: MessageTypes.ADD,
		score: result,
		gameId
	}))
}
const onRoll = () => {
	resultSelected = false
	let interval
	setTimeout(() => {
		sendResult()
		resultSelected = true
		clearInterval(interval)
	}, 1500)
	interval = setInterval(() => {
		result = getRandomResult()
	}, 200)
}
const onTake = e => {
  client.send(JSON.stringify({
		type: MessageTypes.TAKE,
		gameId
	}))
}

onMount(async () => {
	const fetchData = async () => {
		const data = await fetch(`http://localhost:1212/game/${gameId}`)
		const playersRes = await fetch(`http://localhost:1212/game/players/${gameId}`)
		const { currentPlayer, currentScore, state } = await data.json()

		const playerData = await playersRes.json()
		playerList = playerData.players

		score = currentScore
		gameState = state
		current = currentPlayer
	}

	fetchData()

	client.onmessage = e => {
    // TODO: move out, refactor
		const dataParsed = JSON.parse(e.data)
		const { type } = dataParsed

		if (type === MessageTypes.ADD) { 
			const { currentPlayer } = dataParsed
			if (currentPlayer) {
				current = currentPlayer
				score = 0
				result = 0
			} else {
				score += result
			}
		}

		if (type === MessageTypes.TAKE) {
			playerList = playerList.map(player => 
				(player._id === current) ? { 
					...player, score: player.score + score
				} : player)
			const { currentPlayer } = dataParsed
			current = currentPlayer
			score = 0
			result = 0
		}
	}
})
</script>

<main>
	<Dice bind:result />
	<!--
	<MainButton 
		disabled
		on:click={onStart} 
		text='Start'
	/>
	-->
	<MainButton 
		disabled={!canRoll}
		on:click={onRoll} 
		text='Roll'
	/>
	<MainButton
		disabled={!canTake}
		on:click={onTake} 
		text='Take'
	/>
	<GameData
		roll={result}
		{score}
		{gameState}
	/>
	<ScoreBoard 
		{playerList}
		{current}
	/>
</main>

<style>
main {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 1em;
	margin: 0 auto;
	gap: 0.3rem;
}

</style>