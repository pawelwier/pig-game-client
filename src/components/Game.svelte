<script>
import { onMount } from "svelte"
import GameData from "./GameData.svelte"
import Dice from "./dice/Dice.svelte"
import { MessageTypes, getRandomResult } from "../utils"
import { getSocketConnection } from "../websockets/connection"
import MainButton from "./MainButton.svelte"
import ScoreBoard from "./ScoreBoard.svelte"

export let gameId
export let playerId

let socket, result, score, gameState, current
let playerList = []
let player = {}
let resultSelected = false

$: ({ _id, name } = player)
$: isPlayerTurn = current === _id
$: canTake = !!score && isPlayerTurn
$: canRoll = (!result || resultSelected) && isPlayerTurn

const onStart = e => { console.log('start') } // TODO

const sendResult = (points) => {
  socket.send(JSON.stringify({
    type: MessageTypes.ADD,
    points,
    gameId
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

const onTakeMessage = ({ currentPlayer }) => {
  playerList = playerList.map(player => 
    (player._id === current) ? { 
      ...player, score: player.score + score
    } : player)
  current = currentPlayer
  score = 0
  result = 0
}

onMount(async () => {
  const fetchData = async () => {
    const gameRes = await fetch(`http://localhost:1212/game/${gameId}`)
    const playersRes = await fetch(`http://localhost:1212/game/players/${gameId}`)
    const playerRes = await fetch(`http://localhost:1212/player/${playerId}`)

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

  socket = getSocketConnection({ onAddMessage, onTakeMessage })
})
</script>

<div class="game-main">
  <div>
    {isPlayerTurn ? `Your turn, ${name}` : 'Please wait for your turn!'}
  </div>
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
</div>
