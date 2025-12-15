"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: 'Name is required' }),
        contact: zod_1.z.string().min(1, { message: 'Contact is required' }),
        email: zod_1.z
            .string()
            .min(1, { message: 'Email is required' })
            .refine(val => /^\S+@\S+\.\S+$/.test(val), { message: 'Invalid email' }),
        password: zod_1.z.string().min(8, { message: 'Password is required' }),
        location: zod_1.z.string().min(1, { message: 'Location is required' }),
        profile: zod_1.z.string().optional(),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    contact: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
});
exports.UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
};
