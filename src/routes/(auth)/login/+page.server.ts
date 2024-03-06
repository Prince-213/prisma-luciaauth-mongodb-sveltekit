import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userLoginSchema } from '$lib/zod/schema';
import { lucia } from '$lib/server/lucia'
import { prisma } from '$lib/server/prisma'
import { Argon2id } from 'oslo/password';

export const load = (async ({ locals, cookies }) => {
	if (locals.user) {
		return redirect(302, '/');
	}
	return {
		form: await superValidate(zod(userLoginSchema))
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(userLoginSchema));

		console.log(form);

		if (!form.valid) { 
			return fail(404, { form })
		}


		try {
			const existingUser = await prisma.user.findUnique({
				where: {
					email: form.data.email,
				},
				
			})

			if (!existingUser) {
				return fail(404, { form });
			}

			const validPassword = await new Argon2id().verify(existingUser.password, form.data.password);

			if (!validPassword) {
				
				return fail(404, { form });
			}

			console.log(existingUser);
			
			const session = await lucia.createSession(existingUser.id, {});

			console.log(session);

			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return { form };
		} catch (error) {
			console.log(error)
			return fail(404, { form });
		}

		redirect(302, '/');
	}
};