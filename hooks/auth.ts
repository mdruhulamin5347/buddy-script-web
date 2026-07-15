
"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance, setAccessToken } from "@/lib/axios";
import { TLogin, TRegister } from "@/validators/auth";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TRegister) => {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    },

    onSuccess: () => {
      router.push("/login");
    },
  });
};





export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: TLogin) => {
      const res = await axiosInstance.post(
        "/auth/login",
        data
      );

      return res.data;
    },

    onSuccess: (data) => {
        console.log(data.data.accessToken,"+++++++++++++++++++++++++++++")
      const accessToken = data.data.accessToken;

      setAccessToken(accessToken);

      router.push("/");
    },
  });
};


export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },

    onSuccess: () => {
      setAccessToken(null);
      queryClient.clear();
      router.push("/login");
    },

    onError: () => {
      setAccessToken(null);
      queryClient.clear();
      router.push("/login");
    }
  });
};