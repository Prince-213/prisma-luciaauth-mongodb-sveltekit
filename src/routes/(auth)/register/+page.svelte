<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { Loader2 } from 'lucide-svelte';
	import { GithubLogo, NotionLogo } from 'svelte-radix';

	import { superForm } from 'sveltekit-superforms';

	import { toast } from 'svelte-sonner';

	import { Toaster } from '$lib/components/ui/sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types.js';
	import { userRegisterSchema, userLoginSchema } from '$lib/zod/schema';
	import SuperDebug from 'sveltekit-superforms';
	import { Field, Control, Description, FieldErrors, Fieldset, Legend } from 'formsnap';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(userRegisterSchema)
	});
	const { form: formData } = form;

	import { Label } from '$lib/components/ui/label';

	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import { cn } from '$lib/utils';
	import { applyAction, enhance } from '$app/forms';
	import { error } from '@sveltejs/kit';

	let className: string | undefined | null = undefined;
	export { className as class };

	let loading = false;

	let isLoading = false;
	async function onSubmit() {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	}

	$: if (loading) {
		toast.loading('Loading......')
	}
</script>

<div
	class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<Button href="/login" variant="ghost" class="absolute right-4 top-4 md:right-8 md:top-8"
		>Login</Button
	>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		/>
		<div class="relative z-20 flex items-center text-lg font-medium">
			<!-- <Command class="mr-2 h-6 w-6" /> -->
			Acme Inc
		</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;This library has saved me countless hours of work and helped me deliver stunning
					designs to my clients faster than ever before. Highly recommended!&rdquo;
				</p>
				<footer class="text-sm">Sofia Davis</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create an Account</h1>
				<p class="text-sm text-muted-foreground">Fill in the fields below to create an account</p>
			</div>
			<div class={cn('grid gap-6', className)} {...$$restProps}>
				<Toaster richColors position="bottom-right" />

				<form
					action="?/register"
					use:enhance={({ formElement, formData, action, cancel, submitter }) => {
						loading = true;



						//toast.loading('Creating Article...');

						// `formElement` is this `<form>` element
						// `formData` is its `FormData` object that's about to be submitted
						// `action` is the URL to which the form is posted
						// calling `cancel()` will prevent the submission
						// `submitter` is the `HTMLElement` that caused the form to be submitted

						return async ({ result, update }) => {
							applyAction(result);
							update();

							

							loading = false;
							
							

							if (result.type === 'success') {
								toast.success('Registration Successfull');
							} else {
								console.log('erro' + result);
								toast.error('Registration Unsuccessful');
							} 

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
					<div class="grid gap-2">
						<Field {form} name="username">
							<Control let:attrs>
								<Label class=" text-base font-medium">Username</Label>
								<Input
									class=" h-12"
									placeholder="Enter your username"
									{...attrs}
									type="text"
									bind:value={$formData.username}
								/>
							</Control>
							<!-- <Description>Company email is preferred</Description> -->
							<FieldErrors class=" text-red-500" />
						</Field>
						<Field {form} name="email">
							<Control let:attrs>
								<Label class=" text-base font-medium">Email</Label>
								<Input
									class=" h-12"
									placeholder="Enter your email address"
									{...attrs}
									type="email"
									bind:value={$formData.email}
								/>
							</Control>
							<!-- <Description>Company email is preferred</Description> -->
							<FieldErrors class=" text-red-500" />
						</Field>
						<Field {form} name="password">
							<Control let:attrs>
								<Label class=" text-base font-medium">Password</Label>
								<Input
									class=" h-12"
									placeholder="Enter your password"
									{...attrs}
									type="password"
									bind:value={$formData.password}
								/>
							</Control>
							<!-- <Description>Tell us a bit about yourself.</Description> -->
							<FieldErrors class=" text-red-500" />
						</Field>
					</div>

					<Button
						disabled={loading}
						class=" mt-4 w-full gap-x-2 px-4 py-4 text-base  font-medium"
						type="submit"
					>
						{#if loading}
							<Loader2 class=" h-5 w-5 animate-spin text-white" />
						{/if}
						Submit</Button
					>
				</form>

				<!-- <form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-1">
				<Label class="sr-only" for="email">Email</Label>
				<Input
					id="email"
					placeholder="name@example.com"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<Button disabled={isLoading}>
				{#if isLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Sign In with Email
			</Button>
		</div>
	</form> -->
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
					</div>
				</div>
				<Button variant="outline" type="button" disabled={isLoading}>
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<GithubLogo class="mr-2 h-4 w-4" />
					{/if}
					{' '}
					GitHub
				</Button>
			</div>
			<SuperDebug data={$formData} />
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{' '}
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>{' '}
				and{' '}
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
