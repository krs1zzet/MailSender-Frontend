import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { createReceiverRequest, ReceiverDTO, updateReceiverInput } from "../types/Receiver"
import { createReceiver, deleteReceiver, findAllReceiver, findReceiverByEventId, findReceiverById, updateReceiver } from "../api/receiverApi"
import { findByEventId } from "../../mailTemplate/api/mailTemplateApi";
import { input } from "zod";

const QK = {
    receiversAll: ["receivers"] as const,
    receiversByEvent: (eventId: number) => ["receivers","byEvent",eventId] as const,
    receiver: (id:number) => ["receiver",id] as const
}

export function useReceivers(){
    return useQuery<ReceiverDTO[]>({
        queryKey: QK.receiversAll,
        queryFn: findAllReceiver,
        staleTime: 60_000
    });
}

export function useReceiver(id:number){
    return useQuery<ReceiverDTO>({
        queryKey: QK.receiver(id),
        queryFn: () =>findReceiverById(id),
        enabled: !!id,
        staleTime: 60_000
    
    });
}

export function useReceiversByEventId(eventId:number){
    return useQuery<ReceiverDTO[]>({
        queryKey: QK.receiversByEvent(eventId),
        queryFn: () => findReceiverByEventId(eventId),
        enabled: !!eventId,
        staleTime: 60_000
    });
} 

export function useCreateReceivers(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: createReceiverRequest) => createReceiver(input),
        onSuccess: (_d, variables) => {
            qc.invalidateQueries({queryKey: QK.receiversByEvent(variables.eventId)});
            qc.invalidateQueries({queryKey: QK.receiversAll});
        },
    });
}

export function useUpdateReceiver(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: {id: number; input:updateReceiverInput; eventId: number}) => 
            updateReceiver(vars.id,vars.input), 
            onSuccess: (_d,variables) => {
                qc.invalidateQueries({queryKey: QK.receiversByEvent(variables.eventId)});
                qc.invalidateQueries({queryKey: QK.receiversAll});
                qc.invalidateQueries({queryKey: QK.receiver(variables.id)})
            },
    });
}

export function useDeleteReceiver(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: {id:number;eventId:number}) => deleteReceiver(vars.id),
        onSuccess:(_d,vars) => {
            qc.invalidateQueries({queryKey: QK.receiver(vars.id)});
            qc.invalidateQueries({queryKey: QK.receiversByEvent(vars.eventId)})
        }
    })
}