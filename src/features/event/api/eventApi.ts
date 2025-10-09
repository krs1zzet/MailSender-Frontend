import { http } from "../../../lib/http";
import { CreateEventInput, EventDTO } from "../types/event";

// GET /events → liste döner
export async function findAll(): Promise<EventDTO[]> {
  const res = await http.get<EventDTO[]>("/events");
  return res.data;
}

// GET /events/{id} → tek kayıt
export async function findById(id: number): Promise<EventDTO> {
  const res = await http.get<EventDTO>(`/events/${id}`);
  return res.data;
}

// POST /events → create
export async function createEvent(input: CreateEventInput): Promise<void> {
  await http.post<void>("/events", input);
}

// PUT /events/{id} → update
export async function updateEvent(id: number, input: CreateEventInput): Promise<void> {
  await http.put<void>(`/events/${id}`, input);
}

// DELETE /events/{id} → delete
export async function deleteEvent(id: number): Promise<void> {
  await http.delete<void>(`/events/${id}`);
}
