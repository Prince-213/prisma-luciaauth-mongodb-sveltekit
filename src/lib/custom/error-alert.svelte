<script lang="ts">
  import { Terminal, XCircleIcon } from "lucide-svelte";
  import * as Alert from "$lib/components/ui/alert";
	import { SvelteComponent } from "svelte";
  export let error: any
</script>
 
<Alert.Root>
  <XCircleIcon class=" text-red-500 h-4 w-4" />
  <Alert.Title class=" text-red-500">Invalid!</Alert.Title>
  <Alert.Description
    class=" text-red-500"
    ><svelte:component this={error} /></Alert.Description
  >
</Alert.Root>