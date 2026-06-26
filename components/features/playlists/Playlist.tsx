"use client";

import { useAuthStore } from "@/store/authStore";
import ModalLibrary from "./ModalLibrary";
import PlaylistHeader from "./PlaylistHeader";

function Playlist() {
  const { user } = useAuthStore();

  return (
    <>
      {!user?.isLoggedIn ? (
        <ModalLibrary />
      ) : (
        <>
          <PlaylistHeader />
        </>
      )}
    </>
  );
}

export default Playlist;
