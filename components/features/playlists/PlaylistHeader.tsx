"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import CreateForm from "./CreateForm";

function PlaylistHeader() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-amber-500 tracking-[0.2em] uppercase">
            QUẢN LÝ DANH SÁCH PHÁT
          </span>
          <h1 className="text-3xl font-sans font-semibold text-stone-100 tracking-tight mt-1">
            Thư Viện Cá Nhân
          </h1>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-amber-500/30 bg-amber-950/20 text-xs font-semibold text-amber-400 hover:bg-amber-950/40 rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Playlist Mới</span>
        </button>
      </div>
      {showCreateForm && (
        <CreateForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}

export default PlaylistHeader;
