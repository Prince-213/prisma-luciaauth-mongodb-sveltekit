<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';

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
		Eye,
		ChevronDown,
		Bookmark,
		Share2,
		Edit,
		Circle
	} from 'lucide-svelte';

	export let title: string;
	export let content: string;
	export let lang: string;
	export let update: Date;
	export let created: Date;
	export let likes: number;
	export let articleId: string;

	let loading = false;
</script>

<Card.Root>
	<Card.Header class="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
		<div class="space-y-1">
			<Card.Title class=" max-w-[85%] text-2xl font-bold capitalize">{title}</Card.Title>
			<Card.Description class=" line-clamp-4  text-lg font-normal">
				{content}
			</Card.Description>
		</div>
		<div class="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
			<form action="?/likepost">
				<Button variant="secondary" class="px-3 shadow-none">
					<Star class="mr-2 h-4 w-4" />
					Like
				</Button>
			</form>
			<Separator orientation="vertical" class="h-[20px]" />
			<DropdownMenu.Root closeOnItemClick={false}>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="secondary" class="px-2 shadow-none">
						<ChevronDown class="h-4 w-4 text-secondary-foreground" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-[200px]" align="end">
					<DropdownMenu.Label>Suggested Actions</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.CheckboxItem class=" pl-2"
						><div class=" flex w-full items-center justify-start gap-x-2 text-right">
							<Button class=" gap-x-2" variant="ghost">
								<Heart class=" h-4 w-4" /> Add to Favorites</Button
							>
						</div>
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem class=" pl-2"
						><div class=" flex w-full items-center">
							<Button
								class=" gap-x-2"
								on:click={() => goto(`/article/${articleId}`)}
								variant="ghost"
							>
								<Eye class=" h-4 w-4" /> View Article</Button
							>
						</div>
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.CheckboxItem class=" pl-2"
						><div class=" flex w-full items-center gap-x-2">
							<Button class=" gap-x-2" variant="ghost"><Edit class=" h-4 w-4" /> Edit Post</Button>
						</div>
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>
						<form
							action={`?/delete&id=${articleId}`}
							method="POST"
							use:enhance={({ formElement, formData, action, cancel, submitter }) => {
								loading = true;

								// `formElement` is this `<form>` element
								// `formData` is its `FormData` object that's about to be submitted
								// `action` is the URL to which the form is posted
								// calling `cancel()` will prevent the submission
								// `submitter` is the `HTMLElement` that caused the form to be submitted

								return async ({ result, update }) => {
									loading = false;

									applyAction(result);
									invalidateAll();
									update();
									/*if (result.type === 'success') {
										toast.success('Article created successfully.')
									} 
									
									else {
										toast.error('Article not created.')
									} */
									// `result` is an `ActionResult` object
									// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
								};
							}}
						>
							<Button type="submit" variant="ghost">
								<Trash2 class="mr-2 h-4 w-4" />
								{loading ? 'Deleting...' : 'Delete'}
							</Button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Card.Header>
	<Card.Content>
		<div class=" flex space-x-4 text-base text-muted-foreground">
			<div class="flex items-center capitalize">
				<Circle class="mr-1 h-6 w-6 text-sky-400 " />
				{lang}
			</div>
			<div class="flex items-center">
				<Star class="mr-1 h-6 w-6 text-yellow-400" />
				{likes.toString()}k
			</div>
			<div>Updated {update.toUTCString()}</div>
		</div>
	</Card.Content>
</Card.Root>
