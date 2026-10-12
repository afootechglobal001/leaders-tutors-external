import { apiClient } from "@/lib/api-client";

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  cnewPassword: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await apiClient.post<
    { success?: boolean; message?: string },
    ChangePasswordPayload
  >("/user/settings/change-password", payload);
  if (response?.success === false) {
    throw new Error(response.message || "Your password could not be updated.");
  }
  return response;
};
