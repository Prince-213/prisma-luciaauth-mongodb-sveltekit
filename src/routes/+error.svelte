<script lang="ts">
	import { page } from '$app/stores';
</script>



<div class=" w-full text-center flex flex-col justify-center items-center h-screen">
	<div class="  ">
		<h1 class=" font-bold text-3xl">{$page.status}</h1>
		<h1 class=" font-medium text-xl">{$page.error?.message}</h1>
	</div>
</div>