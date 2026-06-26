"use client";

import { Library, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

function ModalLibrary() {
  const router = useRouter();

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto my-12">
      <div className="w-16 h-16 rounded-full bg-amber-950/20 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-6 animate-pulse">
        <Library className="w-7 h-7" />
      </div>

      <span className="text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase">
        KHÔNG GIAN NHÂN VĂN MÃ HÓA
      </span>
      <h2 className="text-2xl font-sans font-semibold text-stone-200 tracking-tight mt-2">
        Thừa hưởng Thư viện Cá nhân
      </h2>

      <p className="text-stone-400 text-xs mt-3 leading-relaxed">
        Để tổ chức danh sách phát cá nhân hóa của riêng bạn, vui lòng xác thực
        tài khoản của bạn.
      </p>

      <button
        onClick={() => router.push("/authentication")}
        className="cursor-pointer mt-8 flex items-center space-x-2 px-6 py-3 rounded-full bg-linear-to-r from-amber-700 to-amber-950 text-stone-100 font-semibold text-xs border border-amber-900/40 hover:from-amber-600 hover:to-amber-900 shadow-lg hover:shadow-amber-950/30 active:scale-95 transition-all duration-300"
      >
        <LogIn className="w-4 h-4" />
        <span>Xác Thực Ngay Để Mở Khóa Thư Viện</span>
      </button>
    </div>
  );
}

export default ModalLibrary;
