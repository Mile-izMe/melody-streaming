"use client";

import { useNotification, useWebSocket } from "@/hooks";

export default function GlobalListener() {
  useWebSocket(); // ← manage connection
  useNotification(); // ← subscribe notification topic
  return null;
}
