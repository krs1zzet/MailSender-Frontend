import { number } from "zod";
import { http } from "../../../lib/http";
import { createReceiverRequest, ReceiverDTO, updateReceiverInput, updateReceiverSchema } from "../types/Receiver";



export async function findAllReceiver(): Promise<ReceiverDTO[]>{
    const res = await http.get<ReceiverDTO[]>("/receivers")
    return res.data
}

export async function findReceiverById(id: number): Promise<ReceiverDTO>{
    const res = await http.get<ReceiverDTO>(`/receivers/${id}`);
    return res.data;
}

export async function findReceiverByEventId(eventId: number): Promise<ReceiverDTO[]> {
    const res = await http.get<ReceiverDTO[]>(`/receivers/event/${eventId}`);
    return res.data;
}

export async function createReceiver(input:createReceiverRequest): Promise<void>{
    await http.post<void>("/receivers",input);
};

export async function deleteReceiver (id: number): Promise<void> {
    await http.delete<void>(`/receivers/${id}`) 
}

export async function updateReceiver (id:number, input:updateReceiverInput): Promise<void>{
    await http.put<void>(`/receivers/${id}`,input);
}