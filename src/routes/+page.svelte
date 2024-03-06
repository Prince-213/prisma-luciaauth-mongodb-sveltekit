<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CreateArticle from '$lib/custom/create-article.svelte';
	import ArtCard from '$lib/custom/article-card.svelte';
	import ArticleCard from '$lib/custom/article-card.svelte';
	import { superForm } from 'sveltekit-superforms';

	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types.js';
	import { allergies, schema, themes } from '$lib/zod/schema';
	import SuperDebug from 'sveltekit-superforms';
	import { Field, Control, Description, FieldErrors, Fieldset, Legend } from 'formsnap';
	import { Loader2, LogOut } from 'lucide-svelte';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(schema)
	});
	const { form: formData } = form;

	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';

	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Textarea } from '$lib/components/ui/textarea';
	import { applyAction, enhance } from '$app/forms';
	import { browser } from '$app/environment';

	import ErrorAlert from '$lib/custom/error-alert.svelte';

	import { toast } from 'svelte-sonner';

	import { Toaster } from '$lib/components/ui/sonner';
	import { invalidateAll } from '$app/navigation';
	import { promise } from 'zod';
	import { fade, fly, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const areas = [
		{
			value: 'London',
			label: 'English'
		},
		{
			value: 'Spain',
			label: 'Spanish'
		},
		{
			value: 'France',
			label: 'French'
		}
	];

	let loading: boolean = false;

	$: if (loading) {
		toast.loading('Creating Artcle......')
	}

	$: ({ articles } = data);
</script>

<div class=" h-screen w-full relative overflow-hidden p-10">
	<h1 class=" text-center text-2xl font-bold">Welcome To Prisma Lucia Test</h1>
	<form class=" absolute top-10 right-10" action="?/logout" method="post" use:enhance >
		<Button variant="destructive" type="submit"> <LogOut /> Log Out</Button>
	</form>
	
	<br />
	<div class=" grid h-screen grid-cols-2 gap-x-10 overflow-hidden">
		<div class=" space-y-6 overflow-y-scroll pb-20 pr-2" id="scrollbar1">
			{#if !browser}
				<div
					in:fly={{ delay: 250, duration: 300, easing: quintOut, x: 50, y: 0 }}
					out:fly={{ delay: 250, duration: 300, easing: quintOut, x: -50, y: 0 }}
					class=" space-y-6"
				>
					<Skeleton class=" h-[200px] w-full" />
					<Skeleton class=" h-[200px] w-full" />
					<Skeleton class=" h-[200px] w-full" />
				</div>
			{:else}
				<div
					in:fly={{ delay: 250, duration: 300, easing: quintOut, x: 50, y: 0 }}
					out:fly={{ delay: 250, duration: 300, easing: quintOut, x: -50, y: 0 }}
					class=" space-y-6"
				>
					{#each articles as article}
						<ArticleCard
							title={article.title}
							content={article.content}
							lang={article.language}
							update={article.updated_at}
							created={article.created_at}
							likes={article.likes}
							articleId={article.id}
						/>
					{/each}
				</div>
			{/if}

			<div class=" hidden">
				<SuperDebug data={$formData} />
			</div>
		</div>
		<div class=" ">
			<Toaster richColors position="bottom-right" />
			{#if !browser}
				<div transition:fade>
					<Skeleton class=" h-[60vh] w-full" />
				</div>
			{:else}
				<Card.Root>
					<form
						action="?/createarticle"
						use:enhance={({ formElement, formData, action, cancel, submitter }) => {
							loading = true;

							

							// `formElement` is this `<form>` element
							// `formData` is its `FormData` object that's about to be submitted
							// `action` is the URL to which the form is posted
							// calling `cancel()` will prevent the submission
							// `submitter` is the `HTMLElement` that caused the form to be submitted

							return async ({ result, update }) => {
								applyAction(result);
							update();

							const promise = new Promise((resolve, reject) =>
								setTimeout(() => {
									if (result.type == 'success') {
										resolve({ });
									} else {
										reject();
									}
								})
							);

							loading = false;
							toast.promise(promise, {
								loading: 'Creating article...',
								success: () => {
									return 'Article created successfully';
								},
								error: 'Error... :( Try again!'
							});
								

								/* applyAction(result);
							invalidateAll();
							if (result.type === 'success') {
								toast.success('Article created successfully.')
							} 
							
							else {
								toast.error('Article not created.')
							} */
								// `result` is an `ActionResult` object
								// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
							};
						}}
						class=""
						method="POST"
					>
						<Card.Header>
							<Card.Title class=" text-3xl font-bold capitalize">create an article</Card.Title>
							<Card.Description class=" text-lg font-normal"
								>Fill in the required fields and create your article</Card.Description
							>
						</Card.Header>
						<Card.Content class="grid gap-2">
							<Field {form} name="title">
								<Control let:attrs>
									<Label class=" text-lg font-semibold">Title</Label>
									<Input
										class=" h-12"
										placeholder="What is the Title of your article"
										{...attrs}
										type="title"
										bind:value={$formData.title}
									/>
								</Control>
								<!-- <Description>Company email is preferred</Description> -->
								<FieldErrors class=" text-red-500" />
							</Field>
							<Field {form} name="content">
								<Control let:attrs>
									<Label class=" text-lg font-semibold">Content</Label>
									<Textarea
										placeholder="Unleash your creativity construct your article"
										rows={5}
										{...attrs}
										bind:value={$formData.content}
									/>
								</Control>
								<!-- <Description>Tell us a bit about yourself.</Description> -->
								<FieldErrors class=" text-red-500" />
							</Field>
							<Field {form} name="language">
								<Control let:attrs>
									<Label class=" text-lg font-semibold">Language</Label>
									<select
										class="  rounded-md border-2 bg-transparent p-4"
										{...attrs}
										bind:value={$formData.language}
									>
										<option value="france">French</option>
										<option value="spain">Spanish</option>
										<option value="london">English</option>
									</select>
								</Control>
								<!-- <Description>Help us address you properly.</Description> -->
								<FieldErrors class=" text-red-500" />
							</Field>
						</Card.Content>
						<Card.Footer class="justify-between space-x-2">
							<Button class=" px-4 py-4 text-lg font-medium" variant="destructive">Cancel</Button>
							<Button
								disabled={loading}
								class=" gap-x-2 px-4 py-4 text-lg font-medium"
								type="submit"
							>
								{#if loading}
									<Loader2 class=" h-5 w-5 animate-spin text-white" />
								{/if}
								Submit</Button
							>
						</Card.Footer>
					</form>
				</Card.Root>
			{/if}

			<!-- <form
				action="?/createarticle"
				use:enhance
				class="mx-auto flex max-w-md flex-col"
				method="POST"
			>
				<Field {form} name="email">
					<Control let:attrs>
						<Label>Email</Label>
						<input {...attrs} type="email" bind:value={$formData.email} />
					</Control>
					<Description>Company email is preferred</Description>
					<FieldErrors />
				</Field>
				<Field {form} name="bio">
					<Control let:attrs>
						<Label>Bio</Label>
						<textarea {...attrs} bind:value={$formData.bio} />
					</Control>
					<Description>Tell us a bit about yourself.</Description>
					<FieldErrors />
				</Field>
				<Field {form} name="language">
					<Control let:attrs>
						<Label>Language</Label>
						<select {...attrs} bind:value={$formData.language}>
							<option value="fr">French</option>
							<option value="es">Spanish</option>
							<option value="en">English</option>
						</select>
					</Control>
					<Description>Help us address you properly.</Description>
					<FieldErrors />
				</Field>
				<Fieldset {form} name="theme">
					<Legend>Select your theme</Legend>
					{#each themes as theme}
						<Control let:attrs>
							<Label>{theme}</Label>
							<input {...attrs} type="radio" value={theme} bind:group={$formData.theme} />
						</Control>
					{/each}
					<Description>We prefer dark mode, but the choice is yours.</Description>
					<FieldErrors />
				</Fieldset>
				<Field {form} name="marketingEmails">
					<Control let:attrs>
						<input {...attrs} type="checkbox" bind:checked={$formData.marketingEmails} />
						<Label>I want to receive marketing emails</Label>
					</Control>
					<Description>Stay up to date with our latest news and offers.</Description>
					<FieldErrors />
				</Field>
				<Fieldset {form} name="allergies">
					<Legend>Food allergies</Legend>
					{#each allergies as allergy}
						<Control let:attrs>
							<input {...attrs} type="checkbox" bind:group={$formData.allergies} value={allergy} />
							<Label>{allergy}</Label>
						</Control>
					{/each}
					<Description>When we provide lunch, we'll accommodate your needs.</Description>
					<FieldErrors />
				</Fieldset>
				<button>Submit</button>
			</form> -->
		</div>
	</div>
</div>

<style>
	#scrollbar1::-webkit-scrollbar {
		width: 8px;
	}

	#scrollbar1::-webkit-scrollbar-track {
		border-radius: 8px;
		background-color: #e7e7e7;
		border: 1px solid #cacaca;
	}

	#scrollbar1::-webkit-scrollbar-thumb {
		border-radius: 6px;
		background-color: #3332324f;
	}
	/*       ScrollBar 2        */

	#scrollbar2::-webkit-scrollbar {
		width: 12px;
	}
</style>
