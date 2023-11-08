<script>
import { onMount } from 'svelte'
import { playerStore } from '../../stores/stores'
import MainSelect from './MainSelect.svelte'

export let gameId

let players = []

const setPlayer = e => { playerStore.set(e.detail) }

onMount(async () => {
  const fetchData = async () => {
    const data = await fetch(`${process.env.API_URL}/game-players?gameId=${gameId}`)
    players = await data.json()
  }
  fetchData()
})
</script>

<MainSelect
  label='Choose your player:'
  options={players}
  paramValue='_id'
  paramLabel='name'
  on:change={setPlayer}
/>