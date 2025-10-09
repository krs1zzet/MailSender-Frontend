import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTemplateInput, CreateTemplateRequest, TemplateDTO, UpdateTemplateInput } from "../types/mailTemplate";
import { createTemplate, deleteTemplate, findAll, findByEventId, findById, updateTemplate, } from "../api/mailTemplateApi";




const QK = {
    templatesAll: ["templates"] as const,
    templatesByEvent: (eventId: number) => ["templates", "byEvent", eventId] as const,
    template: (id: number) => ["template", id] as const,
  };


export function useTemplates(){
    return useQuery<TemplateDTO[]>({
        queryKey: QK.templatesAll,
        queryFn: findAll,
        staleTime: 60_000,
    });
}

export function useTemplate(id: number){
    return useQuery<TemplateDTO>({
        queryKey: QK.template(id),
        queryFn:() => findById(id),
        enabled: !!id,
        staleTime:60_000,
    })
}

export function useTemplatesByEventId(id: number) {
    return useQuery<TemplateDTO[]>({
        queryKey: QK.templatesByEvent(id),
        queryFn: () => findByEventId(id),
        enabled: !!id,
        staleTime: 60_000,
    });
}
export function useCreateTemplate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (input: CreateTemplateRequest) => createTemplate(input),
      onSuccess: (_d, variables) => {
        // create'te variables.eventId kesin var
        qc.invalidateQueries({ queryKey: QK.templatesByEvent(variables.eventId) });
        qc.invalidateQueries({ queryKey: QK.templatesAll });
      },
    });
  }
  
  export function useUpdateTemplate() {
    const qc = useQueryClient();
    return useMutation({
      // eventId'yi invalidate için alıyoruz
      mutationFn: (vars: { id: number; input: UpdateTemplateInput; eventId: number }) =>
        updateTemplate(vars.id, vars.input),
      onSuccess: (updated, vars) => {
        // 1) Liste cache’ini anında güncelle
        qc.setQueryData<TemplateDTO[]>(
          QK.templatesByEvent(vars.eventId),
          (old) => (old ? old.map(t => (t.id === (updated as TemplateDTO).id ? (updated as TemplateDTO) : t)) : old)
        );
  
        // 2) Garanti için refetch
        qc.invalidateQueries({ queryKey: QK.templatesByEvent(vars.eventId) });
        qc.invalidateQueries({ queryKey: QK.template(vars.id) });
      },
    });
  }
  

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; eventId: number }) => deleteTemplate(vars.id),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QK.templatesByEvent(vars.eventId) });
      qc.invalidateQueries({ queryKey: QK.templatesAll });
    },
  });
}