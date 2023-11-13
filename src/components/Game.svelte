<script>
import { onMount } from "svelte"
import Dice from "./dice/Dice.svelte"
import { GameState, getRandomResult } from "../utils"
import { getSocketConnection, sendAddMessage, sendRestartMessage, sendTakeMessage } from "../websockets/connection"
import MainButton from "./MainButton.svelte"
import ScoreBoard from "./ScoreBoard.svelte"
import { scoreStore, gameStateStore } from "../stores/stores"
import WinnerInfo from "./WinnerInfo.svelte"

export let gameId
export let playerId

let socket, result, current, winner
let playerList = []
let player = {}
let resultSelected = true

$: ({ name } = player)
$: isPlayerTurn = current === player._id
$: isGameFinished = $gameStateStore === GameState.FINISHED
$: canTake = !!$scoreStore && isPlayerTurn && resultSelected && result != 1
$: canRoll = (!result || resultSelected) && isPlayerTurn && result != 1
$: canRestart = isGameFinished
$: winnerName = playerList.find(({ _id }) => _id === winner)?.name || ''

const onRoll = () => {
  resultSelected = false
  let interval
  setTimeout(() => {
    clearInterval(interval)
    const points = getRandomResult()
    result = points
    sendAddMessage({ socket, gameId, points })
    resultSelected = true
  }, 1600)
  interval = setInterval(() => {
    result = getRandomResult()
  }, 200)
}

const onAddMessage = ({ currentPlayer, points }) => {
  if (currentPlayer) {
    current = currentPlayer
    scoreStore.set(0)
    result = 0
  } else {
    scoreStore.set($scoreStore + points)
    result = points
  }
}

const onTakeMessage = ({ currentPlayer, isWinner }) => {
  playerList = playerList.map(player => 
    (player._id === current) ? { 
      ...player, score: player.score + $scoreStore
    } : player)
  current = currentPlayer
  scoreStore.set(0)
  result = 0
  if (isWinner) {
    winner = currentPlayer
    gameStateStore.set(GameState.FINISHED)
  }
}

const onRestartMessage = ({ currentPlayer }) => {
  current = currentPlayer
  scoreStore.set(0)
  result = 0
  winner = null
  gameStateStore.set(GameState.NEW)
  playerList = playerList.map(player => (
    {
      ...player,
      score: 0
    }
  ))
}

onMount(async () => {
  const fetchData = async () => {
    const gameRes = await fetch(`${process.env.API_URL}/game?gameId=${gameId}`)
    const playersRes = await fetch(`${process.env.API_URL}/game-players?gameId=${gameId}`)

    const { currentPlayer, currentScore, state } = await gameRes.json()
    playerList = await playersRes.json()
    player = playerList.find(({ _id }) => _id === playerId)

    scoreStore.set(currentScore)
    gameStateStore.set(state)
    current = currentPlayer
  }

  fetchData()

  socket = getSocketConnection({ onAddMessage, onTakeMessage, onRestartMessage })
})
</script>

<div class="game-main">
  {#if !isGameFinished}
    <div>
      {isPlayerTurn ? `Your turn, ${name}` : `Please wait for your turn, ${name}!`}
    </div>
  {/if}
  <Dice bind:result />
  <MainButton 
    disabled={!canRestart}
    on:click={() => sendRestartMessage({ socket, gameId, current })} 
    text='Restart'
  />
  <MainButton 
    disabled={!canRoll || isGameFinished}
    on:click={onRoll}
    text='Roll'
  />
  <MainButton
    disabled={!canTake || isGameFinished}
    on:click={() => sendTakeMessage({ socket, gameId })} 
    text='Take'
  />
  <ScoreBoard
    score={$scoreStore}
    {playerList}
    {current}
  />
  {#if winner}
    <WinnerInfo {winnerName} />
  {/if}
</div>
