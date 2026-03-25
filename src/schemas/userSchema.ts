import { z } from 'zod';

export const createUserSchema = z.object({
    username: z
        .string()
        .min(3, "Le nom d'utilisateur doit faire au moins 3 caractères")
        .max(50, "Le nom d'utilisateur ne doit pas dépasser 50 caractères"),
    email: z
        .string()
        .email("Format email invalide")
        .max(255, "L'email ne doit pas dépasser 255 caractères"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,50}$/,
            "Min 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial"
        ),
    confirmPassword: z.string(),
    role: z.enum(['USER', 'ADMIN']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

// Type TypeScript automatique depuis le schéma
export type CreateUserInput = z.infer<typeof createUserSchema>;
