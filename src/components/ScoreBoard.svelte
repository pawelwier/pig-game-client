<script>
export let playerList
export let current
</script>

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