import { string, z } from "zod";

export const baseSendMailSchema = z.object({
  senderId: z.number().int().positive("Sender ID geçerli olmalı"),
  receiverIds: z.array(z.number().int().positive()).min(1, "En az 1 alıcı seçmelisin"),
  mailTemplateId: z.number().int().positive("Template ID geçerli olmalı"),
});

export const sendMailSchema = baseSendMailSchema;

export type SendMailInput = z.infer<typeof sendMailSchema>
export type SendMailRequest = z.infer<typeof sendMailSchema>

export type MailDTO = {
  success:boolean;
  failedEmails:string[],
  message:string
}

