<script>
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher()
  
  const onClick = () => { dispatch('start') }
  </script>
  
  <button 
    class="btn-main"
    on:click={onClick}
  >
    Start
  </button>