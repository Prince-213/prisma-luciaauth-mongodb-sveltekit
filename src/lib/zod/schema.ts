import { z } from 'zod';





export const themes = ['light', 'dark'] as const;
export const languages = ['en', 'es', 'fr'] as const;
export const allergies = ['peanuts', 'dairy', 'gluten', 'soy', 'shellfish'] as const;

export const schema = z.object({
	title: z.string().min(5, 'The title is too short.').max(250, 'The title is too long.'),
	content: z.string().min(20, 'The content is too short.'),
	language: z.string().default('london'),
	
});


export const userRegisterSchema = z.object({
	username: z.string().trim().min(2, 'Your username is too short.').max(250, 'Your username is too long.'),
	email: z.string().email(),
	password: z.string().min(6, "Your password is too short.")
});

export const userLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Your password is too short.')
});