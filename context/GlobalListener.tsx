"use client";

import { useNotification, useWebSocket } from "@/hooks";
import { useEffect } from "react";

export default function GlobalListener() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("[SW] Registered:", reg.scope);
      });
    }
  }, []);
  useWebSocket(); // ← manage connection
  useNotification(); // ← subscribe notification topic
  return null;
}
