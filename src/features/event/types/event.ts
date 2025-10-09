import { z } from "zod";

// Create schema (frontend input için)
export const createEventSchema = z.object({
  name: z.string().min(3, "Etkinlik adı en az 3 karakter olmalı"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  date: z.string().datetime({ message: "Geçerli bir tarih olmalı (ISO format)" }),
  description: z.string().min(6, "Açıklama en az 6 karakter olmalı"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Backend’ten dönen DTO
export type EventDTO = {
  id: number;
  name: string;
  description: string;
  date: string;    // backend Instant → frontend’de string (ISO 8601)
  password: string;
};

export type Event = {
  id: number;
  name: string;
  description: string;
  date: Date;      
  password: string;
};

// Mapper
export function mapEventDto(dto: EventDTO): Event {
  return {
    ...dto,
    date: new Date(dto.date), // string → Date
  };
}
