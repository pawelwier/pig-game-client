<script>
export let score
export let playerList
export let current
</script>

<div class="total-score">
  Total: {score || 0}
</div>

<div class="players-container">
  {#each playerList as { _id, name, score }, i  (i)}
    <div class={_id === current ? 'player-selected' : ''}>
      <div>
        {name}
      </div>
      <div>
        {score}
      </div>
    </div>
  {/each}
</div>