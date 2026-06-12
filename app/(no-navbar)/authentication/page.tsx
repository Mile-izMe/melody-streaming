"use client";
import { User } from "@/types";
import {
  AudioWaveform,
  Headphones,
  KeyRound,
  Lock,
  Mail,
  Mic2,
  ShieldCheck,
  Sparkles,
  UserIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface AuthenticationProps {
  onLoginSuccess: (user: User) => void;
}

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

function AuthenticationPage({ onLoginSuccess }: AuthenticationProps) {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    // Auto populate email if log in
    const userEmail = email || `${username.toLowerCase()}@melodystream.com`;
    const selectedAvatar = avatar || PRESET_AVATARS[0].url;

    onLoginSuccess({
      username: username,
      email: userEmail,
      isLoggedIn: true,
      avatarUrl: selectedAvatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-md" />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-stone-900/90 border border-amber-950/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Decorative Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-950/40 border border-stone-800 text-stone-400 hover:text-amber-400 hover:border-amber-900/50 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side */}
        <div className="w-full md:w-[45%] bg-stone-950/65 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-950/30 overflow-y-auto">
          <div>
            {/* Tagline */}
            <div className="flex items-center space-x-2 text-amber-500 mb-4">
              <Headphones className="w-4 h-4" />
              <span className="text-xs font-mono tracking-widest uppercase">
                Premium Audio Experience
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-sans font-medium text-stone-200 tracking-tight leading-snug">
              Melody Stream <br />
              <span className="text-amber-500">Secure Backend Connect</span>
            </h3>

            {/* Description */}
            <p className="text-stone-400 text-xs mt-3 leading-relaxed">
              Log in to unlock your personalized music sanctuary. Save your
              favorite tracks, follow visionary artists, and immerse yourself in
              an endless universe of sound.
            </p>

            {/* Feature List */}
            <div className="mt-6 space-y-3.5">
              <div className="flex items-start space-x-2 text-stone-400 text-xs">
                <AudioWaveform className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-300">Hi-Res Audio:</strong>{" "}
                  Experience studio-quality (Lossless) streaming that preserves
                  every detail and raw emotion of the original track.
                </div>
              </div>
              <div className="flex items-start space-x-2 text-stone-400 text-xs">
                <Mic2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-300">For Artists:</strong> The
                  ultimate platform to upload your masterpieces, showcase your
                  unique style, and connect directly with your fanbase.
                </div>
              </div>
              <div className="flex items-start space-x-2 text-stone-400 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-300">Smart Discovery:</strong>{" "}
                  Our AI analyzes your listening habits to curate a daily
                  soundtrack perfectly tailored to your unique taste.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Box */}
          <div className="mt-8 pt-4 border-t border-stone-900">
            <div className="w-full flex items-center justify-between text-left text-xs bg-amber-950/20 border border-amber-950/60 rounded-lg p-3 text-amber-400">
              <span className="font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Your personal data is strictly secured
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Animated Input Fields */}
        <div className="w-full md:w-[55%] p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6">
            <span className="text-[10px] font-mono text-amber-500 tracking-[0.2em] uppercase">
              {isRegister ? "XÁC THỰC NGHỆ SĨ MỚI" : "CHÀO MỪNG QUAY LẠI"}
            </span>
            <h2 className="text-2xl font-sans font-semibold text-stone-100 tracking-tight mt-1">
              {isRegister ? "Đăng Ký Tài Khoản" : "Đăng Nhập Giao Diện"}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Khám phá không gian âm nhạc Nhật Bản tân tiến thượng lưu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs text-stone-400 font-medium">
                Tên tài khoản / Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên tài khoản..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/60 border border-stone-800 rounded-xl text-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 placeholder:text-stone-600 transition-all"
                />
              </div>
            </div>

            {/* Email (only shown if registering) */}
            {isRegister && (
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs text-stone-400 font-medium">
                  Email liên hệ
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="example@melody.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950/60 border border-stone-800 rounded-xl text-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 placeholder:text-stone-600 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs text-stone-400 font-medium">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/60 border border-stone-800 rounded-xl text-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 placeholder:text-stone-600 transition-all"
                />
              </div>
            </div>

            {/* Avatar Selectors */}
            <div className="space-y-2 flex flex-col pt-1">
              <span className="text-xs text-stone-400 font-medium">
                Chọn phong ảnh đại diện
              </span>
              <div className="flex space-x-3.5">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.name}
                    type="button"
                    onClick={() => setAvatar(av.url)}
                    className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                      avatar === av.url
                        ? "border-amber-500 scale-110 shadow-lg"
                        : "border-stone-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-amber-700 to-amber-950 text-stone-100 rounded-xl font-medium text-sm border border-amber-900/40 hover:from-amber-600 hover:to-amber-900 hover:shadow-lg hover:shadow-amber-950/40 active:scale-98 transition-all duration-300"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {isRegister ? "Hoàn Tất Đăng Ký" : "Bắt Đầu Trải Nghiệm"}
              </span>
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-stone-400 hover:text-amber-400 text-xs transition-colors duration-300"
            >
              {isRegister ? (
                <>
                  Đã có tài khoản?{" "}
                  <span className="text-amber-500 font-medium underline ms-1">
                    Đăng nhập
                  </span>
                </>
              ) : (
                <>
                  Chưa có tài khoản?{" "}
                  <span className="text-amber-500 font-medium underline ms-1">
                    Register
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;
