<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

const onClick = () => {
  dispatch('take')
}
</script>

<button 
  class="btn-main"
  on:click={onClick}
>
  Take
</button>