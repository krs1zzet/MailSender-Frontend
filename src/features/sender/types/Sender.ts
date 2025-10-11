import {z} from "zod";

export const baseSenderSchema = z.object({
    email: z.email("invalid email"),
    password: z.string()
});

export const createSenderSchema = baseSenderSchema.extend({
    eventId: z.number().int().positive("Sender id gecerli olmali"),
});

export type CreateSenderInput = z.infer<typeof baseSenderSchema>
export type CreateSenderRequest = z.infer<typeof createSenderSchema>

export const updateSenderSchema = baseSenderSchema;

export type UpdateSenderInput = z.infer<typeof updateSenderSchema>
export type UpdateSenderRequest = z.infer<typeof updateSenderSchema>


export type SenderDTO = {
    id: number;
    email: string;
    createdAt: string;
    lastUsedAt: string;
    eventId: number;
}