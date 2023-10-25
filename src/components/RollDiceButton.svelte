<script>
import { createEventDispatcher } from 'svelte'
import { getRandomResult } from './dice/dice'

const dispatch = createEventDispatcher()

const onClick = () => {
  const result = getRandomResult()
  dispatch('roll', result)
}
</script>

<button
  class="btn-main"
  on:click={onClick}
>
  Roll
</button>