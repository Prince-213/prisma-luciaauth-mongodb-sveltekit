
import { prisma } from '$lib/server/prisma';

import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ url, params, locals }) => {

	

	console.log(params.articleId)
	let data

	try {
		data = await prisma.article.findUnique({
			where: {
				id: params.articleId
			}
			
		})

		await prisma.article.update({
			where: {
				id: params.articleId
			},
			data: {
				likes: {
					increment: 1
				}
			}
		})

		console.log(data)
	} catch (err) {
		console.log(err)
	}

	return {
		article: data
	};
}) satisfies PageServerLoad;
