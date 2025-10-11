import { useMutation } from "@tanstack/react-query";
import { http } from "../../../lib/http";
import { sendMail } from "../api/sendMailApi";
import { SendMailRequest } from "../types/Send";

export function useSendMail(){
    return useMutation({
        mutationFn: (input: SendMailRequest) => sendMail(input),
        onSuccess: (data) => {
            console.log("✅ Mail başarıyla gönderildi:", data);
          },
    })
}