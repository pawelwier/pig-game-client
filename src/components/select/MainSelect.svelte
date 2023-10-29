<script>
import { createEventDispatcher } from 'svelte'

export let label
export let options
export let paramValue
export let paramLabel

const dispatch = createEventDispatcher()

const onChange = e => { dispatch('change', e.target.value) }
</script>

<div class="main-select">
  <div>
    {label}
  </div>
  <select on:change={onChange}>
    <option></option>
    {#each options as option, i (i)}
      <option value={option[paramValue]}>
        {option[paramLabel]}
      </option>
    {/each}
  </select>
</div>