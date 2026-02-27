import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { queryClient } from "@/lib/query-client";
import {
  FetchSkillAreaListParams,
  SkillAreaCourseContentResponse,
  SkillAreaListResponse,
  SkillAreasCourseParams,
  SkillAreasCourseResponse,
  SkillAreasItems,
} from "@/types/admin/programs/skillArea/skillArea";
import { CreateSkillAreaTypes } from "@/types/admin/programs/skillArea/schema";

const fetchCourseraCourseList = async (
  params: SkillAreasCourseParams
): Promise<SkillAreasCourseResponse> => {
  const response = await api.get(`/admin/coursera/course/list`, { params });
  return response.data;
};
export const useFetchCourseraCourseList = (params: SkillAreasCourseParams) => {
  return useQuery<SkillAreasCourseResponse>({
    queryKey: ["all-audience", params],
    queryFn: () => fetchCourseraCourseList(params),
  });
};

const fetchSingleCourseraCourse = async (
  id: string
): Promise<SkillAreaCourseContentResponse> => {
  const response = await api.get(`/admin/coursera/course/${id}/detail`);
  return response.data;
};

export const useFetchSingleCourseraCourse = (id?: string) => {
  return useQuery<SkillAreaCourseContentResponse>({
    queryKey: ["single-course", id],
    queryFn: () => fetchSingleCourseraCourse(id as string),
    enabled: !!id, // 👈 only run when id is truthy
  });
};

export const createSkillArea = async (data: CreateSkillAreaTypes) => {
  const response = await api.post("/admin/skill-area/create", data);
  return response.data;
};

export const useCreateSkillArea = () => {
  return useMutation({
    mutationFn: (data: CreateSkillAreaTypes) => createSkillArea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-skill-areas"],
      });
    },
    onError: (error) => {
      console.error("Create Skill Area failed:", error);
    },
  });
};

const fetchAllSkillAreas = async (
  params: FetchSkillAreaListParams
): Promise<SkillAreaListResponse> => {
  const response = await api.get(`/admin/skill-area/list`, { params });
  return response.data;
};
export const useFetchAllSkillAreas = (params: FetchSkillAreaListParams) => {
  return useQuery<SkillAreaListResponse>({
    queryKey: ["all-skill-areas", params],
    queryFn: () => fetchAllSkillAreas(params),
  });
};

//// fetch single skill area details
const fetchSingleSkillArea = async (id: string): Promise<SkillAreasItems> => {
  const response = await api.get(`/admin/skill-area/${id}/detail`);
  return response.data.data;
};
export const useFetchSingleSkillArea = (id?: string) => {
  return useQuery<SkillAreasItems>({
    queryKey: ["single-skill-area", id],
    queryFn: () => fetchSingleSkillArea(id as string),
    enabled: !!id, // 👈 only run when id is truthy
  });
};
