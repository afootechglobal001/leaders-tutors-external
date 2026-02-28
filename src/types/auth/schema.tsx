import * as z from "zod";
export const AuthLoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  user_type: z.enum(["ADMIN", "USER"]),
});
export type AuthLoginType = z.infer<typeof AuthLoginSchema>;

export const InvitationPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirm_password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
export type InvitationPasswordTypes = z.infer<typeof InvitationPasswordSchema>;

export const rejectInvitationSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
});
export type rejectInvitationTypes = z.infer<typeof rejectInvitationSchema>;
