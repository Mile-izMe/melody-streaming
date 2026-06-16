import React from "react";

function UploadPage() {
  return (
    <div className="max-w-xl mx-auto bg-stone-900/40 p-8 rounded-2xl border border-amber-950/20 text-center space-y-5 backdrop-blur-md">
      <span className="text-[9px] font-mono tracking-widest text-[#d4af37] block">
        MANAGED CREATIVE STATION
      </span>
      <h2 className="text-2xl font-sans font-semibold text-stone-200">
        Bàn Đăng Tác Phẩm
      </h2>
      <p className="text-stone-400 text-xs leading-relaxed">
        Bạn đang đứng trong căn phòng đăng tải đặc quyền danh giá của cộng đồng
        Melody Stream. Hãy cung cấp tệp âm nhạc thô cùng tiêu đề để chuẩn hóa.
      </p>
      <button
        // onClick={() => setUploadModalOpen(true)}
        className="cursor-pointer px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-950 border border-amber-900/30 text-stone-100 text-xs font-bold rounded-full hover:from-amber-600 hover:to-amber-900 shadow-md transition-all duration-300"
      >
        Mở Khung Đăng Tải Tác Phẩm
      </button>
    </div>
  );
}

export default UploadPage;
