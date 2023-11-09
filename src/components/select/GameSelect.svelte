<script>
  import { onMount } from "svelte"
  import { gameStore } from "../../stores/stores"
  import MainSelect from "./MainSelect.svelte";
  
  let games = []
  
  const setGame = e => { gameStore.set(e.detail) }
  
  onMount(async () => {
    const fetchData = async () => {
      const data = await fetch(`${process.env.API_URL}/game`)
      games = await data.json()
    }
    fetchData()
  })
  </script>
  
  <MainSelect 
    label='Select game:'
    options={games}
    paramValue='_id'
    paramLabel='name'
    on:change={setGame}
  />