<script>
import Pip from "./Pip.svelte"
import { diceOptions } from "../../utils"

export let result = 0

$: pipsVisible = diceOptions[result]

const pips = Array.from({ length: 9 }, (_, i) => i)
</script>

<div class="dice-pip-container">
  {#each pips as pip}
    <div>
      {#if pipsVisible.includes(pip)}
        <Pip />
      {/if}
    </div>
  {/each}
</div>