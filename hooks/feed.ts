import { axiosInstance } from "@/lib/axios";
import { TCreateFeed } from "@/validators/feed";
import { useMutation } from "@tanstack/react-query";

export const useCreateFeed = () => {
  return useMutation({
    mutationFn: async(data:TCreateFeed)=>{
      const formData = new FormData();
      if(data.content){
        formData.append(
          "content",
          data.content
        );
      }
      if(data.image){
        formData.append(
          "image",
          data.image
        );
      }
      formData.append(
        "visibility",
        data.visibility
      );
      const res = await axiosInstance.post(
        "/feeds",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      );
      return res.data;
    },
    onSuccess:(data)=>{
      console.log("Feed created", data);
    },
    onError:(error:any)=>{
      console.log(
        error.response?.data
      );
    }
  });
};