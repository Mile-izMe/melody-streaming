"use client";

import {
  authApi,
  createLoginSchema,
  createRegisterSchema,
  LoginInput,
  RegisterInput,
  setTokenCookie,
} from "@/libs";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Lock, Mail, UserIcon } from "lucide-react";
import { Locale, useTranslations } from "next-intl";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AvatarPicker from "./AvatarPicker";

const PRESET_AVATARS = [
  {
    name: "Zen Mist",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Cyber Samurai",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Golden Bonsai",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
  },
  {
    name: "Nara Deer",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  },
];

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [serverError, setServerError] = useState("");

  const t = useTranslations("authentication.login_form");
  const tAvatar = useTranslations("authentication.avatar_picker");
  const tValidation = useTranslations("authentication.validation");
  const { login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: Locale }>();

  // ── Automatically swap when changing mode ──────────────────────
  const schema = isRegister
    ? createRegisterSchema(tValidation)
    : createLoginSchema(tValidation);

  const form = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  // ── Submit Handler ──────────────────────
  const onSubmit = async (data: LoginInput | RegisterInput) => {
    setServerError("");
    try {
      const payload = isRegister
        ? ({ ...data, avatarUrl: selectedAvatar } as RegisterInput)
        : (data as LoginInput);

      const res = isRegister
        ? await authApi.register(payload as RegisterInput)
        : await authApi.login(payload as LoginInput);

      login(
        {
          username: res.user.username,
          email: res.user.email,
          avatarUrl: res.user.avatarUrl,
          isLoggedIn: true,
        },
        res.accessToken,
        res.refreshToken,
      );

      setTokenCookie(res.accessToken);

      const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}/`;
      router.push(callbackUrl);
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : t("server_error"),
      );
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    reset();
    setServerError("");
  };

  const inputCls = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-2.5 bg-stone-950/60 border rounded-xl text-stone-200 text-sm 
     focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 
     placeholder:text-stone-600 transition-all ${
       hasError ? "border-red-500/60" : "border-stone-800"
     }`;

  return (
    <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[10px] font-mono text-amber-500 tracking-[0.2em] uppercase">
          {isRegister ? t("badge_register") : t("badge_login")}
        </span>
        <h2 className="text-2xl font-sans font-semibold text-stone-100 tracking-tight mt-1">
          {isRegister ? t("title_register") : t("title_login")}
        </h2>
        <p className="text-xs text-stone-400 mt-1">{t("description")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs text-stone-400 font-medium">
            {t("email_label")}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              {...register("email")}
              type="email"
              placeholder={t("email_placeholder")}
              className={inputCls(!!errors.email)}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-red-400">{errors.email.message}</span>
          )}
        </div>

        {/* Username — chỉ register */}
        {isRegister && (
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs text-stone-400 font-medium">
              {t("username_label")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                {...register("username")}
                type="text"
                placeholder={t("username_placeholder")}
                className={inputCls(
                  !!(errors as { username?: { message?: string } }).username,
                )}
              />
            </div>
            {(errors as { username?: { message?: string } }).username && (
              <span className="text-xs text-red-400">
                {
                  (errors as { username?: { message?: string } }).username
                    ?.message
                }
              </span>
            )}
          </div>
        )}

        {/* Password */}
        <div className="space-y-1.5 flex flex-col">
          <label className="text-xs text-stone-400 font-medium">
            {t("password_label")}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              {...register("password")}
              type="password"
              placeholder={t("password_placeholder")}
              className={inputCls(!!errors.password)}
            />
          </div>
          {errors.password && (
            <span className="text-xs text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Avatar picker — chỉ register */}
        {isRegister && (
          <AvatarPicker
            avatars={PRESET_AVATARS}
            selected={selectedAvatar}
            onSelect={setSelectedAvatar}
            label={tAvatar("label")}
          />
        )}

        {/* Server error */}
        {serverError && (
          <p className="text-xs text-red-400 text-center">{serverError}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full mt-6 flex items-center justify-center space-x-2 py-3 bg-linear-to-r from-amber-700 to-amber-950 text-stone-100 rounded-xl font-medium text-sm border border-amber-900/40 hover:from-amber-600 hover:to-amber-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <KeyRound className="w-4 h-4" />
          <span>
            {isSubmitting
              ? t("submit_loading")
              : isRegister
                ? t("submit_register")
                : t("submit_login")}
          </span>
        </button>
      </form>

      {/* Toggle */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={toggleMode}
          className="cursor-pointer text-stone-400 hover:text-amber-400 text-xs transition-colors duration-300"
        >
          {isRegister ? (
            <>
              {t("toggle_login_prompt")}{" "}
              <span className="text-amber-500 font-medium underline ml-1">
                {t("toggle_login_action")}
              </span>
            </>
          ) : (
            <>
              {t("toggle_register_prompt")}{" "}
              <span className="text-amber-500 font-medium underline ml-1">
                {t("toggle_register_action")}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
