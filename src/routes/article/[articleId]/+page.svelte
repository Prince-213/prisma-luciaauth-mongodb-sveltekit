<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { applyAction } from '$app/forms';

	import type { ActionResult } from '@sveltejs/kit';
	import {
		Trash2,
		Star,
		Heart,
		Plus,
		ChevronDown,
		Bookmark,
		Share2,
		Edit,
		Circle
	} from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let { article } = data;

	let loading = false;
</script>

<div class=" h-screen w-full py-8">
	<Card.Root class=" mx-auto w-[90%]">
		<Card.Header class="relative grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
			<div class="space-y-6">
				<Card.Title class=" text-2xl font-bold capitalize">{article?.title}</Card.Title>
				<div class="max-w-fit space-x-1 rounded-md">
					<div class=" flex space-x-6 text-base text-muted-foreground">
						<div class="flex items-center capitalize">
							<Circle class="mr-1 h-6 w-6 text-sky-400 " />
							{article?.language}
						</div>
						<div class="flex items-center">
							<Star class="mr-1 h-6 w-6 text-yellow-400" />
							{article?.likes}k
						</div>
						<div>Updated {article?.updated_at.toUTCString()}</div>
					</div>
				</div>
				<Separator />
				<Card.Description class=" text-lg font-normal"
					>{article?.content}</Card.Description
				>
			</div>
		</Card.Header>
		<Card.Content></Card.Content>
	</Card.Root>
</div>
