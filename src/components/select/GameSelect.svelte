<script>
  import { onMount } from "svelte"
  import { gameStore } from "../../stores/stores"
  import MainSelect from "./MainSelect.svelte";
  
  let games = []
  
  const setGame = e => { gameStore.set(e.detail) }
  
  onMount(async () => {
    const fetchData = async () => {
      const data = await fetch('http://localhost:1212/game')
      games = await data.json()
    }
    fetchData()
  })
  </script>
  
  <MainSelect 
    label='Select game ID:'
    options={games}
    paramValue='_id'
    paramLabel='_id'
    on:change={setGame}
  />