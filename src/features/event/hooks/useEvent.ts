import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateEventInput, EventDTO } from "../types/event";
import { createEvent, deleteEvent, findAll, findById, updateEvent } from "../api/eventApi";


const QK = {
    events: ["events"] as const,
    event: (id: number) => ["events", id] as const,
};

export function useEvents() {
    return useQuery<EventDTO[]>({
      queryKey: QK.events,
      queryFn: findAll,
      staleTime: 60_000,
    });
  }

export function useEvent(id: number) {
    return useQuery<EventDTO>({
        queryKey: QK.event(id),
        queryFn: () => findById(id),
        enabled: !!id,
        staleTime: 60_000,
    });
}

export function useCreateEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateEventInput) => createEvent(input),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: QK.events});
        },
    });
}

export function useUpdateEvent(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: CreateEventInput }) =>
            updateEvent(id,input),
        onSuccess: (_data,variables) => {
            qc.invalidateQueries({queryKey: QK.events});
            qc.invalidateQueries({ queryKey: QK.event(variables.id)});
        },
    });
}

export function useDeleteEvent(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteEvent(id),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: QK.events});
        },
    });
}