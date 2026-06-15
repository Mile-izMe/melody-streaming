import { User } from "@/types";
import { publicApi } from "./api";
import { LoginInput, RegisterInput } from "../validations";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  login: (data: LoginInput): Promise<AuthResponse> =>
    publicApi.post("/api/auth/login", data),

  register: (data: RegisterInput): Promise<AuthResponse> =>
    publicApi.post("/api/auth/register", data),

  refreshToken: (refreshToken: string): Promise<AuthResponse> =>
    publicApi.post("/api/auth/refresh", { refreshToken }),
};
