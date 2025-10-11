import { http } from "../../../lib/http";
import { ReceiverDTO } from "../../receiver/types/Receiver";
import { CreateSenderRequest, SenderDTO, UpdateSenderInput, UpdateSenderRequest } from "../types/Sender";



export async function findAllSender(): Promise<SenderDTO[]> {
    const res = await http.get<SenderDTO[]>("/senders")
    return res.data;
}

export async function findSenderById(id:number): Promise<SenderDTO> {
    const res = await http.get<SenderDTO>((`/senders/${id}`));
    return res.data;
}

export async function findSendersByEventId(eventId:number): Promise<SenderDTO[]> {
    const res = await http.get<SenderDTO[]>((`/senders/${eventId}`));
    return res.data;
}

export async function createSender(input:CreateSenderRequest):Promise<void>{
     await http.post<void>("/senders",input);
}

export async function deleteSender(id:number):Promise<void> {
    await http.delete<void>(`/senders/${id}`);    
}

export  async function updateSender(id:number,input:UpdateSenderRequest):Promise<void> {
    await http.put<void>(`/senders/${id}`,input);
}