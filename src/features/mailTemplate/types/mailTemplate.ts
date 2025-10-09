{/**
    @NotNull(message = validationMessages.MAIL_TEMPLATE_NULL_HEADER)
    private String header;

    @NotNull(message = validationMessages.MAIL_TEMPLATE_NULL_BODY)
    private String body;

    private Long eventId;
}


*/}

import {z} from "zod"

export const createTemplateSchema = z.object({
    header:z.string().min(6,"header min 6 harf olmali"),
    body:z.string().min(6,"body min 6 bolmali"),
})

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

export type CreateTemplateRequest = CreateTemplateInput & {
    eventId: number;
  };

export const updateTemplateSchema = z.object({
  header: z.string().min(1, "Header gerekli"),
  body: z.string().min(1, "Body gerekli"),
});
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;

export type TemplateDTO = {
    id:number;
    header:string;
    body:string;
    eventId:number;
}