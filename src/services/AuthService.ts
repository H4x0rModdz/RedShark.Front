import { api } from "./api";
import { ILoginRequest, ILoginResponse } from "@/types/IUser";

const endpoint = "api/Auth"

export const AuthService = {
  Login: async (data: ILoginRequest) => {
    const response = await api.post(`${endpoint}/Login`, data);
    return response.data as ILoginResponse;
  },
};

export default AuthService;
