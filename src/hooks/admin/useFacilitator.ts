import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { queryClient } from "@/lib/query-client";
import { MentorSchematypes } from "@/types/admin/users/mentors/schema";
import {
  FetchFacilitatorParams,
  FacilitatorListResponse,
} from "@/types/admin/users/facilitator/facilitator";

export const createFacilitator = async (data: MentorSchematypes) => {
  const response = await api.post("/admin/facilitator/invite", data);
  return response.data;
};

export const useCreateFacilitator = () => {
  return useMutation({
    mutationFn: (data: MentorSchematypes) => createFacilitator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-facilitators"],
      });
    },
    onError: (error) => {
      console.error("Facilitator Invitation failed:", error);
    },
  });
};

const fetchAllFacilitators = async (
  params: FetchFacilitatorParams,
): Promise<FacilitatorListResponse> => {
  const response = await api.get(`/admin/facilitator/list`, { params });
  return response.data;
};
export const useFetchAllFacilitators = (params: FetchFacilitatorParams) => {
  return useQuery<FacilitatorListResponse>({
    queryKey: ["all-facilitators", params],
    queryFn: () => fetchAllFacilitators(params),
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
