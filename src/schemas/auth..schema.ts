import { z } from "zod";


export const SignupSchema = z.object({
    body: z.object({
        userName: z.string().nonempty("UserName is required")
        .min(2, "User too short").max(16, "The userName must not exceed 16 characters"),
        email: z.string().nonempty("Email is required")
        .email({ message: "Write a correct email" }),
        password: z.string().nonempty("Password is required")
        .regex(/^(?=(.*[a-zA-Z].*){2,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9 \S]{6,16}$/),
    })
})


export const LoginSchema = z.object({
    body: z.object({
        email: z.string().email({ message: "Wrong email or password" }).optional(),
        userName: z.string().min(2, "User too short").max(16, "The userName must not exceed 16 characters").optional(),
        password: z.string().nonempty("Password is required").min(6, "Wrong email or password"),
    })
})


export type SignupBodyType = z.infer<typeof SignupSchema>["body"]
export type LoginBodyType = z.infer<typeof LoginSchema>["body"]