import { User } from "@/types";
import { publicApi } from "./api";
import { LoginInput, RegisterInput } from "../validations";

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  message: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  login: (data: LoginInput): Promise<LoginResponse> =>
    publicApi.post("/api/auth/login", data),

  register: (data: RegisterInput): Promise<RegisterResponse> =>
    publicApi.post("/api/auth/register", data),

  refreshToken: (
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> =>
    publicApi.post("/api/auth/refresh", { refreshToken }),

  logout: (): Promise<{ message: string }> =>
    publicApi.post("/api/auth/logout"),
};
