import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userRegisterSchema } from '$lib/zod/schema';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { prisma } from '$lib/server/prisma';
import { lucia } from '$lib/server/lucia';

import { ObjectId } from 'mongodb';

export const load = (async ({ locals }) => {

	if (locals.user) {
		return redirect(302, '/');
	}
	
	return {
		form: await superValidate(zod(userRegisterSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
		await sleep(4000);
		const form = await superValidate(request, zod(userRegisterSchema));

		console.log(form);

		// Convenient validation check:
		if (!form.valid) {
			// Always return { form } and things will just work.
			return fail(400, { form });
		}

		const userId = new ObjectId().toString();
		console.log('userid is' + userId + 'lenght' + userId.length);
		const hashedPassword = await new Argon2id().hash(form.data.password);

		// TODO: check if username is already used
		 
		try {
			await prisma.user.create({
				data: {
					id: userId,
					username: form.data.username,
					email: form.data.email,
					password: hashedPassword
				}
			})

			const session = await lucia.createSession(userId, {});

			console.log(session);

			
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return { form }
		} catch (e) {
			console.error(e);
			return fail(400, { form });
		}

		

		redirect(302, '/');
	}
};
