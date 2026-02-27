import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { queryClient } from "@/lib/query-client";
import {
  AuthLoginType,
  InvitationPasswordTypes,
  rejectInvitationTypes,
} from "@/types/admin/auth/schema";

export const login = async (data: AuthLoginType) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: AuthLoginType) => login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loggedInUser"],
      });
    },
  });
};

export const acceptInvitation = async (data: InvitationPasswordTypes) => {
  const response = await api.post(
    "/admin/invitation/accept-and-set-password",
    data
  );
  return response.data;
};

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: (data: InvitationPasswordTypes) => acceptInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loggedInUser"],
      });
    },
  });
};

export const rejectInvitation = async (data: rejectInvitationTypes) => {
  const response = await api.post("/admin/invitation/reject", data);
  return response.data;
};

export const useRejectInvitation = () => {
  return useMutation({
    mutationFn: (data: rejectInvitationTypes) => rejectInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loggedInUser"],
      });
    },
  });
};
