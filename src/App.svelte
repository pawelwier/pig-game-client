<script>
import Game from "./components/Game.svelte"
import GameSelect from "./components/select/GameSelect.svelte"
import PlayerSelect from "./components/select/PlayerSelect.svelte"
import { gameStore, playerStore } from './stores/stores'

$: gameId = $gameStore
$: playerId = $playerStore
</script>

{#if gameId && playerId}
	<Game {gameId} {playerId} />
{:else}
{#if gameId}
		<PlayerSelect {gameId} />
	{:else}
		<GameSelect />
	{/if}
{/if}