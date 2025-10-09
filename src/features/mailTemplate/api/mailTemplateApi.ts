// src/features/mailTemplate/api/mailTemplateApi.ts
import { http } from "../../../lib/http";
import {
  CreateTemplateRequest,
  TemplateDTO,
  UpdateTemplateInput,
} from "../types/mailTemplate";

export async function findAll(): Promise<TemplateDTO[]> {
  const res = await http.get<TemplateDTO[]>("/mailTemplates");
  return res.data;
}

export async function findByEventId(eventId: number): Promise<TemplateDTO[]> {
  const res = await http.get<TemplateDTO[]>(`/mailTemplates/event/${eventId}`);
  return res.data;
}

export async function findById(id: number): Promise<TemplateDTO> {
  const res = await http.get<TemplateDTO>(`/mailTemplates/${id}`); 
  // Eğer böyle bir endpoint yoksa bunu eklemek yerine şimdilik kullanmayabilirsin.
  return res.data;
}

export async function createTemplate(input: CreateTemplateRequest): Promise<void> {
  await http.post<void>("/mailTemplates", input);
}

export async function updateTemplate(
    id: number,
    input: UpdateTemplateInput
  ): Promise<TemplateDTO> {
    const res = await http.put<TemplateDTO>(`/mailTemplates/${id}`, input);
    return res.data;
  }
  

export async function deleteTemplate(id: number): Promise<void> {
  await http.delete<void>(`/mailTemplates/${id}`);
}
