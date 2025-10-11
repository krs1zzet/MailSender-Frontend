import { useMutation } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { MailDTO, SendMailRequest } from "../types/sendMail";
import { sendMail } from "../api/sendMailApi";

export function useSendMail(){
    return useMutation({
        mutationFn: (input: SendMailRequest) => sendMail(input),
        onSuccess: (data) => {
            console.log("✅ Mail başarıyla gönderildi:", data);
          },
    })
}