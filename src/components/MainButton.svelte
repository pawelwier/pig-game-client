<script>
import { createEventDispatcher } from 'svelte'
import { getRandomResult } from '../utils'

export let text = ''
export let disabled = false

const dispatch = createEventDispatcher()

const onClick = () => {
  const result = getRandomResult()
  dispatch('roll', result)
}
</script>

<button
  {disabled}
  class="btn-main"
  on:click
>
  {text}
</button> 