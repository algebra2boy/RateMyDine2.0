import { z } from 'zod';

export const SignUpSchema = z.object({
    body: z.object({
        userName: z.string().min(1, 'user name should have at least one character'),
        email: z
            .string()
            .min(1, 'email should have at least one character')
            .email('This is not a valid email'),
        password: z.string().min(8, 'password should have at least eight characters'),
        firstName: z.string().min(1, 'first name should have at least one character'),
        lastName: z.string().min(1, 'last name should have at least one character'),
    }),
});

export const LoginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, 'email should have at least one character')
            .email('This is not a valid email'),
        password: z.string().min(8, 'password should have at least eight characters'),
    }),
});
