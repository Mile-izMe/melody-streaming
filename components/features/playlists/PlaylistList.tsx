import React from "react";

function PlaylistList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left List of Playlists */}
      <div className="md:col-span-1 space-y-3">
        <span className="text-xs font-mono text-stone-500 tracking-wide">
          CHỌN TUYỂN TẬP
        </span>
        
      </div>
    </div>
  );
}

export default PlaylistList;
