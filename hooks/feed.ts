import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TCreateComment, TCreateFeed, TUpdateComment, TUpdateFeed } from "@/validators/feed";

// ─── Feeds ───────────────────────────────────────────────────────────────────

export const useCreateFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TCreateFeed & { image?: File }) => {
      const formData = new FormData();
      if (data.content) formData.append("content", data.content);
      if (data.image) formData.append("image", data.image);
      formData.append("visibility", data.visibility);
      const res = await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};

export const useUpdateFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TUpdateFeed & { image?: File } }) => {
      const formData = new FormData();
      if (data.content) formData.append("content", data.content);
      if (data.image) formData.append("image", data.image);
      if (data.visibility) formData.append("visibility", data.visibility);
      const res = await axiosInstance.patch(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};

export const useDeleteFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/posts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};

export const useGetFeeds = (params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["feeds", params],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts", { params });
      return res.data;
    },
  });
};

// ─── Comments ────────────────────────────────────────────────────────────────

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TCreateComment) => {
      const res = await axiosInstance.post("/comments", data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.feedId] });
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TUpdateComment }) => {
      const res = await axiosInstance.patch(`/comments/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/comments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};

export const useGetCommentsByFeed = (feedId: string) => {
  return useQuery({
    queryKey: ["comments", feedId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/comments/feed/${feedId}`);
      return res.data;
    },
    enabled: !!feedId,
  });
};

// ─── Likes ───────────────────────────────────────────────────────────────────

export const useToggleFeedLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedId: string) => {
      const res = await axiosInstance.post(`/likes/post/${feedId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await axiosInstance.post(`/likes/comment/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};