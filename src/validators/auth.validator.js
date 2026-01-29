import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        fullName: z.string().min(3, "Full name must be at least 3 characters long"),
        username: z.string().min(3, "Username must be at least 3 characters long"),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z.string().min(8, "New password must be at least 8 characters long"),
    }),
});

export const updateAccountSchema = z.object({
    body: z.object({
        fullName: z.string().min(3, "Full name must be at least 3 characters long").optional(),
        email: z.string().email("Invalid email address").optional(),
    }),
});
