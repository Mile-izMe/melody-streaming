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

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const t = useTranslations("authentication.login_form");
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
      if (isRegister) {
        // ── Register — No token ──────────────────────
        const res = await authApi.register(data as RegisterInput);
        setSuccessMessage(res.message);
      } else {
        // ── Login ──────────────────────
        const res = await authApi.login(data as LoginInput);
        console.log("Login response:", res);

        login(
          {
            id: res.userId,
            username: res.username,
            email: res.email,
            isLoggedIn: true,
          },
          res.tokens.accessToken,
          res.tokens.refreshToken,
        );

        setTokenCookie(res.tokens.accessToken);

        const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}/`;
        router.push(callbackUrl);
      }
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
    setSuccessMessage("");
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

        {/* Server error */}
        {serverError && (
          <p className="text-xs text-red-400 text-center">{serverError}</p>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30">
            <span className="text-amber-400">✦</span>
            <p className="text-xs text-amber-300 mt-0.5 leading-relaxed">
              {successMessage}
            </p>
          </div>
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
