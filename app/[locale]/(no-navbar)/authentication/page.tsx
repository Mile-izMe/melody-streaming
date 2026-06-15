import { Introduction, LoginForm } from "@/components/features/authentication";

export default function AuthenticationPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-md" />
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-stone-900/90 border border-amber-950/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side */}
        <Introduction />
        {/* Right Side */}
        <LoginForm />
      </div>
    </div>
  );
}
