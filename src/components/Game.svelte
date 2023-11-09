<script>
import { onMount } from "svelte"
import GameData from "./GameData.svelte"
import Dice from "./dice/Dice.svelte"
import { GameState, MessageTypes, getRandomResult } from "../utils"
import { getSocketConnection } from "../websockets/connection"
import MainButton from "./MainButton.svelte"
import ScoreBoard from "./ScoreBoard.svelte"
    import Pip from "./dice/Pip.svelte";

export let gameId
export let playerId

let socket, result, score, gameState, current, winner
let playerList = []
let player = {}
let resultSelected = false

$: ({ _id, name } = player)
$: isPlayerTurn = current === _id
$: isGameFinished = gameState === GameState.FINISHED
$: canTake = !!score && isPlayerTurn && resultSelected
$: canRoll = (!result || resultSelected) && isPlayerTurn
$: canRestart = isGameFinished
$: currentPlayerName = playerList.find(({ _id }) => _id === current)?.name || ''

const onStart = e => { console.log('start') } // TODO

const sendResult = (points) => {
  socket.send(JSON.stringify({
    type: MessageTypes.ADD,
    points,
    gameId
  }))
}

const onRestart = () => {
  socket.send(JSON.stringify({
    type: MessageTypes.RESTART,
    gameId,
    currentPlayer: current
  }))
}

const onRoll = () => {
  resultSelected = false
  let interval
  setTimeout(() => {
    clearInterval(interval)
    const points = getRandomResult()
    result = points
    sendResult(points)
    resultSelected = true
  }, 1600)
  interval = setInterval(() => {
    result = getRandomResult()
  }, 200)
}

const onTake = e => {
  socket.send(JSON.stringify({
    type: MessageTypes.TAKE,
    gameId
  }))
}

const onAddMessage = ({ currentPlayer, points }) => {
  if (currentPlayer) {
    current = currentPlayer
    score = 0
    result = 0
  } else {
    score += points
    result = points
  }
}

const onTakeMessage = ({ currentPlayer, isWinner }) => {
  playerList = playerList.map(player => 
    (player._id === current) ? { 
      ...player, score: player.score + score
    } : player)
  current = currentPlayer
  score = 0
  result = 0
  console.log({isWinner})
  if (isWinner) {
    winner = currentPlayer
    gameState = GameState.FINISHED
  }
}

const onRestartMessage = ({ currentPlayer }) => {
  current = currentPlayer
  score = 0
  result = 0
  winner = null
  gameState = GameState.NEW
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
    const playerRes = await fetch(`${process.env.API_URL}/player?playerId=${playerId}`)

    const { currentPlayer, currentScore, state } = await gameRes.json()

    const playersData = await playersRes.json()
    playerList = playersData

    const playerData = await playerRes.json()
    player = playerData

    score = currentScore
    gameState = state
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
    on:click={onRestart} 
    text='Restart'
  />
  <MainButton 
    disabled={!canRoll || isGameFinished}
    on:click={onRoll} 
    text='Roll'
  />
  <MainButton
    disabled={!canTake || isGameFinished}
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
  {#if winner}
    <div class="winner-container">
      <div class="winner-text">
        And the winner is ...
      </div>
      <div class="winner-name">
        {currentPlayerName} !!!!
      </div>
    </div>
  {/if}
</div>
