// src/pages/EventPage.tsx
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import EventForm from "../../features/event/components/EventForm";
import { useCreateEvent, useDeleteEvent, useEvents } from "../../features/event/hooks/useEvent";
import { localDatetimeToISO } from "../../utils/dateMapper";
import { CreateEventInput, EventDTO } from "../../features/event/types/event";
import { Navigate, useNavigate } from "react-router";
import { deleteEvent } from "../../features/event/api/eventApi";

export default function EventPage() {
  const { data: events, isLoading, error } = useEvents();
  const createEvent = useCreateEvent();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const deleteEvent = useDeleteEvent();
 

  const handleCreate = async (values: CreateEventInput) => {
    // formdan gelen date'i ISO'ya çevir
    await createEvent.mutateAsync(values);
    setOpen(false);
  };

  const handleDelete = async (input:EventDTO) => {
    await deleteEvent.mutateAsync(input.id);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p>Loading Events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p className="text-red-600">Failed to load events</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
      {/* Create Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Yeni Event Yarat
      </button>

      {/* Modal + Form */}
      <Modal open={open} onClose={() => setOpen(false)} title="Create Event">
        <EventForm onSubmit={handleCreate} submitLabel="Create" />
      </Modal>

      {/* List */}
      {!events || events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              onClick={() => navigate(`/events/${event.id}`)}   // ✅ burası
              key={event.id}
              className="border rounded-lg shadow p-6 bg-white hover:shadow-lg transition cursor-pointer group relative"
            >
              <h2 className="text-xl font-bold mb-2">{event.name}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleString()}
              </p>
              <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(event);
              }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
              >Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
