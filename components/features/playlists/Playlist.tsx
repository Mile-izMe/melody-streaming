"use client";

import { useAuthStore } from "@/store/authStore";
import ModalLibrary from "./ModalLibrary";
import PlaylistHeader from "./PlaylistHeader";
import PlaylistList from "./PlaylistList";

function Playlist() {
  const { user } = useAuthStore();

  return (
    <>
      {!user?.isLoggedIn ? (
        <ModalLibrary />
      ) : (
        <>
          <PlaylistHeader />
          <PlaylistList />
        </>
      )}
    </>
  );
}

export default Playlist;
