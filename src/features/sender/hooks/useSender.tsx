import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateSenderRequest, SenderDTO, UpdateSenderRequest } from "../types/Sender"
import { createSender, deleteSender, findAllSender, findSenderById, findSendersByEventId, updateSender } from "../api/senderApi"




const QK = {
    sendersAll : ["senders"] as const,
    sendersByEvent : (eventId:number) => ["senders","byEvent",eventId] as const,
    sender: (id:number) => ["sender",id] as const
}

export function useSenders(){
    return useQuery<SenderDTO[]>({
        queryKey: QK.sendersAll,
        queryFn: findAllSender,
        staleTime:60_000
    });
}

export function useSender(id:number){
    return useQuery<SenderDTO>({
        queryKey: QK.sender(id),
        queryFn: () => findSenderById(id),
        enabled: !!id,
        staleTime: 60_000
    });
}

export function useSendersByEventId(eventId:number){
    return useQuery<SenderDTO[]>({
        queryKey: QK.sendersByEvent(eventId),
        queryFn: () => findSendersByEventId(eventId),
        enabled: !!eventId,
        staleTime: 60_000
    });
}

export function useCreateSender(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateSenderRequest) => createSender(input),
        onSuccess: (_d, variables) => {
            qc.invalidateQueries({queryKey: QK.sendersByEvent(variables.eventId)});
            qc.invalidateQueries({queryKey: QK.sendersAll});
        },
    });
}

export function useDeleteSender(){

    const qc = useQueryClient();
    return useMutation({
        
        mutationFn: (vars: {id:number;eventId:number}) => deleteSender(vars.id),
        onSuccess: (_d,vars) => {
            qc.invalidateQueries({queryKey: QK.sender(vars.id)});
            qc.invalidateQueries({queryKey: QK.sendersByEvent(vars.eventId)})
        }
    })
}


export function useUpdateSender(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars:{id:number;input: UpdateSenderRequest;eventId: number}) => updateSender(vars.id , vars.input),
        onSuccess: (_d,variables) => {
            qc.invalidateQueries({queryKey: QK.sender(variables.id)});
            qc.invalidateQueries({queryKey: QK.sendersAll});
            qc.invalidateQueries({queryKey: QK.sendersByEvent(variables.eventId)});
        },
    })
}