"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
// 1. Verify Email
const createVerifyEmailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, { message: 'Email is required' }),
        oneTimeCode: zod_1.z
            .number({ message: 'One time code is required' })
            .int({ message: 'One time code must be an integer' }),
    }),
});
// 2. Login
const createLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, { message: 'Email is required' }),
        password: zod_1.z.string().min(1, { message: 'Password is required' }),
    }),
});
// 3. Forget Password
const createForgetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, { message: 'Email is required' }),
    }),
});
// 4. Reset Password
const createResetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string().min(6, { message: 'Password is required' }),
        confirmPassword: zod_1.z
            .string()
            .min(6, { message: 'Confirm Password is required' }),
    }),
});
// 5. Change Password
const createChangePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z
            .string()
            .min(6, { message: 'Current Password is required' }),
        newPassword: zod_1.z.string().min(6, { message: 'New Password is required' }),
        confirmPassword: zod_1.z
            .string()
            .min(6, { message: 'Confirm Password is required' }),
    }),
});
exports.AuthValidation = {
    createVerifyEmailZodSchema,
    createForgetPasswordZodSchema,
    createLoginZodSchema,
    createResetPasswordZodSchema,
    createChangePasswordZodSchema,
};
