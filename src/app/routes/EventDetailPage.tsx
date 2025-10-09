import { useNavigate, useParams } from "react-router-dom";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate(`/events/${id}/templates`)}
          className="text-left border rounded-lg shadow p-6 bg-white hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Mail Template</h2>
        </button>

        <button
          onClick={() => navigate(`/events/${id}/receivers`)}
          className="text-left border rounded-lg shadow p-6 bg-white hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Receiver</h2>
        </button>

        <button
          onClick={() => navigate(`/events/${id}/senders`)}
          className="text-left border rounded-lg shadow p-6 bg-white hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold mb-2">Sender</h2>
        </button>
      </div>
    </div>
  );
}
