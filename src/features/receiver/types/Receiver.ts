import {z} from "zod";

export const baseReceiverSchema = z.object({
    fname: z.string().min(6,"firstname min 6 olmali"),
    lname: z.string().min(6,"min 6 olmali"),
    email: z.string().min(6,"min 6 olmali"),
    groupName: z.string().min(6,"min 6 olmali")
});

export const createReceiverSchema = baseReceiverSchema.extend({
    eventId: z.number().int().positive("Event id gecerli olmali"),
});

//Create Request
export type CreateReceiverInput = z.infer<typeof baseReceiverSchema>;
export type createReceiverRequest = z.infer<typeof createReceiverSchema>;


//Update Request

export const updateReceiverSchema = baseReceiverSchema;
export type updateReceiverInput = z.infer<typeof updateReceiverSchema>;

export type ReceiverDTO = {
    id: number;
    fname: string;
    lname: string;
    email: string;
    groupName: string;
    eventId: number;
}
