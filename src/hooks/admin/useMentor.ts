import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { queryClient } from "@/lib/query-client";
import { MentorSchematypes } from "@/types/admin/users/mentors/schema";
import {
  FetchMentorsParams,
  MentorListResponse,
} from "@/types/admin/users/mentors/mentors";

export const createMentor = async (data: MentorSchematypes) => {
  const response = await api.post("/admin/mentor/invite", data);
  return response.data;
};

export const useCreateMentor = () => {
  return useMutation({
    mutationFn: (data: MentorSchematypes) => createMentor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-mentors"],
      });
    },
    onError: (error) => {
      console.error("Mentor Invitation failed:", error);
    },
  });
};

const fetchAllMentors = async (
  params: FetchMentorsParams,
): Promise<MentorListResponse> => {
  const response = await api.get(`/admin/mentor/list`, { params });
  return response.data;
};
export const useFetchAllMentors = (params: FetchMentorsParams) => {
  return useQuery<MentorListResponse>({
    queryKey: ["all-mentors", params],
    queryFn: () => fetchAllMentors(params),
  });
};

// //// fetch single skill area details
// const fetchSingleSkillArea = async (id: string): Promise<SkillAreasItems> => {
//   const response = await api.get(`/admin/skill-area/${id}/detail`);
//   return response.data.data;
// };
// export const useFetchSingleSkillArea = (id?: string) => {
//   return useQuery<SkillAreasItems>({
//     queryKey: ["single-skill-area", id],
//     queryFn: () => fetchSingleSkillArea(id as string),
//     enabled: !!id, // 👈 only run when id is truthy
//   });
// };
