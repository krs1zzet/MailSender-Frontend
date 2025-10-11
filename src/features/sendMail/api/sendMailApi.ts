import { http } from "../../../lib/http";
import { MailDTO, SendMailRequest } from "../types/sendMail";


export async function sendMail(input:SendMailRequest): Promise<MailDTO> {
    const res = await http.post<MailDTO>('/send-mail',input);
    return res.data;
}