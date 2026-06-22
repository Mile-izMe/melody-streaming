import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type SubscriptionCallback = (data: unknown) => void;

class WebSocketClient {
  private client: Client | null = null;
  private subscriptions: Map<string, Set<SubscriptionCallback>> = new Map();
  private getAccessToken: (() => string | null) | null = null;
  private onTokenExpired: (() => Promise<string | null>) | null = null;

  init(
    getToken: () => string | null,
    refreshToken: () => Promise<string | null>,
  ) {
    this.getAccessToken = getToken;
    this.onTokenExpired = refreshToken;
  }

  connect(userId: string) {
    if (this.client?.active) return; // đã connect rồi thì bỏ qua

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(
          `${process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080"}/ws`,
        ),
      connectHeaders: {
        Authorization: `Bearer ${this.getAccessToken?.()}`,
      },

      reconnectDelay: 5000,

      beforeConnect: async () => {
        const token = this.getAccessToken?.();
        if (!token) return;
        if (this.client) {
          this.client.connectHeaders = {
            Authorization: `Bearer ${token}`,
          };
        }
      },

      onConnect: () => {
        console.log("[WS] Connected");
        // Re-subscribe all on connect
        this.resubscribeAll();
      },

      onDisconnect: () => console.log("[WS] Disconnected"),

      onStompError: async (frame) => {
        console.error("[WS] Error:", frame);

        // Error 401 → refresh token → reconnect
        if (
          frame.headers?.message?.includes("401") ||
          frame.headers?.message?.includes("Unauthorized")
        ) {
          console.log("[WS] Token expired, refreshing...");
          const newToken = await this.onTokenExpired?.();
          if (newToken && this.client) {
            this.client.connectHeaders = {
              Authorization: `Bearer ${newToken}`,
            };
            // Auto reconnect by reconnectDelay
          } else {
            // Token refresh fail → disconnect
            this.disconnect();
          }
        }
      },

      onWebSocketError: (event) =>
        console.error("[WS] WebSocket error:", event),
      onWebSocketClose: (event) =>
        console.log("[WS] WebSocket close:", event.code, event.reason),
    });

    this.client.activate();
  }

  disconnect() {
    this.client?.deactivate();
    this.client = null;
    this.subscriptions.clear();
  }

  // Subscribe to 1 topic, receive callback
  subscribe(topic: string, callback: SubscriptionCallback) {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());
    }
    this.subscriptions.get(topic)!.add(callback);

    // If already connected, subscribe immediately
    if (this.client?.connected) {
      // ← dùng .connected thay vì .active
      this.client.subscribe(topic, (msg) => {
        const data = JSON.parse(msg.body);
        this.subscriptions.get(topic)?.forEach((cb) => cb(data));
      });
    }
  }

  unsubscribe(topic: string, callback: SubscriptionCallback) {
    this.subscriptions.get(topic)?.delete(callback);
    if (this.subscriptions.get(topic)?.size === 0) {
      this.subscriptions.delete(topic);
    }
  }

  private resubscribeAll() {
    this.subscriptions.forEach((_, topic) => {
      this.client?.subscribe(topic, (msg) => {
        const data = JSON.parse(msg.body);
        this.subscriptions.get(topic)?.forEach((cb) => cb(data));
      });
    });
  }
}

// Singleton — dùng chung toàn app
export const wsClient = new WebSocketClient();
