<script>
import { onMount } from 'svelte'
import { wsConnect } from '../websockets/websockets'

onMount(() => { wsConnect() })
</script>