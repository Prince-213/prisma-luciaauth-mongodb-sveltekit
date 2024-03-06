
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { schema } from '$lib/zod/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import { toast } from 'svelte-sonner';
import { lucia } from '$lib/server/lucia'

export const load: PageServerLoad = async ({ locals }) => {
	
	if (!locals.user) {
		return redirect(302, '/login');
	}

	
	const articles = await prisma.article.findMany();

	return {
		form: await superValidate(zod(schema)),
		articles: articles ?? [],
		
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		return redirect(302, "/login");
	},
	
	createarticle: async ({ request }) => {
		// Use superValidate in form actions too, but with the request
		const form = await superValidate(request, zod(schema));

		console.log(form);

		// Convenient validation check:
		if (!form.valid) {
			// Always return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.dat

		//const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

		try {
			await prisma.article.create({
				data: {
					title: form.data.title,
					content: form.data.content,
					language: form.data.language,
					created_at: new Date()
				}
			});
		} catch (e) {
			return fail(400, { form });
		}

		// Yep, return { form } here too

		/* try {
			await sleep(3000);

			console.log('strike')

			return { form };
		} catch (e) {

		} */

		return { form };
	},

	delete: async ({ request, url }) => {
		let id = url.searchParams.get('id') ?? '';
		const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

		try {
			await prisma.article.delete({
				where: {
					id: id
				}
			});
		} catch (err) {
			console.error(err);
		}
	}
};
