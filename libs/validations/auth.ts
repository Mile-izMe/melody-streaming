import { z } from "zod";

type MessageGetter = (key: string) => string;

export const createLoginSchema = (t: MessageGetter) =>
  z.object({
    email: z.string().email(t("email_invalid")),
    password: z.string().min(6, t("password_min_length")),
  });

export const createRegisterSchema = (t: MessageGetter) =>
  z.object({
    email: z.string().email(t("email_invalid")),
    username: z.string().min(3, t("username_min_length")),
    password: z.string().min(6, t("password_min_length")),
    avatarUrl: z.string().url().optional(),
  });

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
